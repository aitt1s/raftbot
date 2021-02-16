import { Message } from "discord.js";
import { Sorted, periods, commands } from "../../types/Raftbot";
import axios from "axios";
import { InputConfig } from "../../handlers/inputConfig";

async function getChart(
  data,
  configs: InputConfig,
  message?: Message
): Promise<string> {
  const chart = {
    type: configs?.type || "bar",
    data: {
      labels: data.map((d) => d.label),
      datasets: [
        {
          label: "jee",
          data: data.map((d) => d.count),
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
    if (configs?.type !== "top")
      return await sendChartMessage(message, datasets, configs);

    if (periods.includes(configs.grouping)) {
      return await sendTopPeriodList(message, datasets, configs);
    }

    await sendTopList(message, datasets, configs);
  } catch (error) {
    console.log("Sending ATH shitters failed", error);
  }
}

export async function sendTopPeriodList(
  message: Message,
  shitters: Sorted[],
  configs
): Promise<void> {
  try {
    const header = `Spread of shits in ${configs.period} by ${configs.grouping}`;
    const interval = `${configs.interval.toFormat("dd.MM HH:mm")}`;

    const mapShitters = shitters
      .map((shitter) => `${shitter.label}, ${shitter.count} times 💩`)
      .join(`\n`);

    const footer = `Total of ${shitters.reduce(
      (acc, shitter) => (acc += shitter.count || 0),
      0
    )} shits taken 🚀🚽`;

    const messageString = `\`\`\`${header}\n${interval}\n\n${mapShitters}\n\n${footer} \`\`\``;

    await message.channel.send(messageString);
  } catch (error) {
    console.log("Sending top shitters failed", error);
  }
}

export async function sendTopList(
  message: Message,
  shitters: Sorted[],
  configs
): Promise<void> {
  try {
    const header = `Top ${configs.period} shitters grouped by ${configs.grouping}`;
    const interval = `${configs.interval.toFormat("dd.MM HH:mm")}`;

    const mapShitters = shitters
      .map(
        (shitter, idx) =>
          `${idx + 1}. ${shitter.label}, ${shitter.count} times 💩`
      )
      .join(`\n`);

    const footer = `Total of ${shitters.reduce(
      (acc, shitter) => (acc += shitter.count || 0),
      0
    )} shits taken 🚀🚽`;

    const messageString = `\`\`\`${header}\n${interval}\n\n${mapShitters}\n\n${footer} \`\`\``;

    await message.channel.send(messageString);
  } catch (error) {
    console.log("Sending top shitters failed", error);
  }
}

export async function sendChartMessage(
  message: Message,
  datesets,
  configs: InputConfig
): Promise<void> {
  try {
    const url = await getChart(datesets, configs, message);

    await sendChart(message, url);
  } catch (error) {
    console.log("Sending weekly shitters failed", error);
  }
}

export async function sendHelp(message: Message, error = null): Promise<void> {
  const mapCommands =
    `commands:\n` +
    Object.keys(commands)
      .map((command) => `!raftbot ${command}`)
      .join("\n");

  const errorMessage = error
    ? `Uups, you tried with command "${message.content}". Its not supported 💩\n\nTry following `
    : "";

  const messageString = `\`\`\`${errorMessage}${mapCommands}\`\`\``;

  await message.channel.send(messageString);
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
