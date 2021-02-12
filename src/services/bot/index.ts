import { Message } from "discord.js";
import { Entry, Dateset, InputCommand, InputType } from "../../types/Raftbot";
import axios from "axios";
import { DateTime } from "luxon";
import { InputConfig } from "../../handlers/inputConfig";

function getTimeLabels(configs: InputConfig) {
  if (configs.smallUnits) {
    return {
      hour: "2-digit",
    };
  }

  return {
    weekday: "short",
    month: "short",
    day: "2-digit",
  };
}

function getLabels(dateset: Dateset, configs: InputConfig) {
  if (configs?.command === InputCommand.TOP) return dateset?.author?.username;

  return dateset.date.toLocaleString(getTimeLabels(configs) as any);
}

function getLabel(message: Message, configs: InputConfig) {
  if (configs?.command === InputCommand.MY) return message.author.username;

  return "Total";
}

async function getChart(
  datesets: Dateset[],
  configs: InputConfig,
  message?: Message
): Promise<string> {
  const chart = {
    type: configs?.type?.toLowerCase() || "bar",
    data: {
      labels: datesets.map((dateset) => getLabels(dateset, configs)),
      datasets: [
        {
          label: getLabel(message, configs),
          data: datesets.map((dataset) => dataset.count),
        },
      ],
    },
  };

  try {
    const { data } = await axios.post("https://quickchart.io/chart/create", {
      backgroundColor: "white",
      chart,
    });

    return data.url;
  } catch (error) {
    console.log("Could not fetch the chart", error);
  }
}

async function sendChart(message: Message, url: string): Promise<void> {
  await message.channel.send({
    files: [
      {
        attachment: url,
        name: "total.png",
      },
    ],
  });
}

export async function sendToChannel(
  message,
  datasets,
  configs: InputConfig
): Promise<void> {
  try {
    if (configs?.type !== InputType.LIST)
      return await sendChartMessage(message, datasets, configs);

    await sendTopList(message, datasets, configs);
  } catch (error) {
    console.log("Sending ATH shitters failed", error);
  }
}

export async function sendTopList(
  message: Message,
  shitters: Dateset[],
  configs
): Promise<void> {
  try {
    await message.channel.send(formatMessage(shitters, configs));
  } catch (error) {
    await message.channel.send('Message probably too long 🚽🚽')
    console.log("Sending shitters failed", error);
  }
}

export async function sendChartMessage(
  message: Message,
  datesets: Dateset[],
  configs: InputConfig
): Promise<void> {
  try {
    const url = await getChart(datesets, configs, message);

    await sendChart(message, url);
  } catch (error) {
    console.log("Sending weekly shitters failed", error);
  }
}

export async function sendHelp(message: Message): Promise<void> {
  await message.channel.send(`
  !raftbot weekly
  !raftbot daily total
  !raftbot monthly top pie
  !raftbot daily total by-hours
  `);
}

export async function confirmPoop(message: Message): Promise<void> {
  try {
    await message.react("✅");

    const randomQuote = await getRandomQuote();

    if (randomQuote) {
      await message.reply(randomQuote);
    }
  } catch (error) {
    console.log("Confirm poop failed", error);
  }
}

export async function getRandomQuote(): Promise<string> {
  try {
    const {
      data: { content, author },
    } = await axios.get("https://api.quotable.io/random");

    if (content && author) {
      return `${content} _${author}_`;
    }
  } catch (error) {
    console.log("Couldn't fetch random quote", error.message);
  }
}

function formatShitters(shitters: Dateset[], configs: InputConfig): string {
  return shitters
    .map((shitter, index) => {
      const author = shitter?.author?.username;

      if (author) return `${index + 1}. ${author}, ${shitter.count} times 💩`;

      return `${shitter.date.toLocaleString(getTimeLabels(configs))}, ${
        shitter.count
      } times 💩`;
    })
    .join("\n");
}

function formatMessage(shitters: Dateset[], configs: InputConfig): string {
  return `\`\`\`Top ${
    configs?.unit || "total"
  } shitters \n${configs.interval.toFormat("dd.MM HH:mm")}\n\n${formatShitters(
    shitters,
    configs
  )}\n\nTotal ${total(shitters)} shits taken 🚀🚽 \`\`\``;
}

function total(shitters: Dateset[]) {
  return shitters.reduce((acc, shitter) => (acc += shitter.count || 0), 0);
}
