import { Message } from "discord.js";
import { Entry, Dateset } from "../../types/Raftbot";
import axios from "axios";
import { DateTime } from "luxon";
import { units, commands, types } from "../../helpers/normalizers";

export async function sendToChannel(message, entries, configs) {
  try {
    if (configs?.command === "me") {
      sendPersonal(message, entries, configs);
      return;
    }

    if (configs?.command === "total") {
      sendTotal(message, entries, configs);
      return;
    }

    if (configs?.command === "top") {
      if (!configs?.type || configs.type === "list") {
        sendTop(message, entries, configs);
        return;
      }

      if (configs.type && configs.type !== "list") {
        sendTopGraph(message, entries, configs);
        return;
      }
    }

    if (configs.type) {
      sendTopGraph(message, entries, configs);
      return;
    }

    sendTop(message, entries, configs);
  } catch (error) {
    console.log("Sending ATH shitters failed", error);
  }
}

export async function sendTop(
  message: Message,
  shitters: Entry[],
  configs
): Promise<void> {
  try {
    await message.channel.send(formatMessage(shitters, configs));
  } catch (error) {
    console.log("Sending ATH shitters failed", error);
  }
}

export async function sendTopGraph(message, shitters, configs) {
  try {
    const chart = {
      type: configs?.type || "bar",
      data: {
        labels: shitters.map((entry) => entry.author.username),
        datasets: [
          {
            label: configs.command || "Total",
            data: shitters.map((entry) => entry.count),
          },
        ],
      },
    };

    const { data } = await axios.post("https://quickchart.io/chart/create", {
      backgroundColor: "white",
      chart,
    });

    message.channel.send({
      files: [
        {
          attachment: data.url,
          name: "total.png",
        },
      ],
    });
  } catch (error) {
    console.log("Sending weekly shitters failed", error);
  }
}

export async function sendTotal(
  message: Message,
  datasets: Dateset[],
  configs
): Promise<void> {
  try {
    const chart = {
      type: configs?.type || "bar",
      data: {
        labels: datasets.map((dataset) =>
          dataset.date.toLocaleString({
            weekday: "short",
            month: "short",
            day: "2-digit",
          })
        ),
        datasets: [
          {
            label: configs.command || "Total",
            data: datasets.map((dataset) => dataset.count),
          },
        ],
      },
    };

    const { data } = await axios.post("https://quickchart.io/chart/create", {
      backgroundColor: "white",
      chart,
    });

    message.channel.send({
      files: [
        {
          attachment: data.url,
          name: "total.png",
        },
      ],
    });
  } catch (error) {
    console.log("Sending weekly shitters failed", error);
  }
}

export async function sendPersonal(
  message: Message,
  datasets: Dateset[],
  configs
): Promise<void> {
  try {
    const chart = {
      type: configs?.type || "bar",
      data: {
        labels: datasets.map((dataset) =>
          dataset.date.toLocaleString({
            weekday: "short",
            month: "short",
            day: "2-digit",
          })
        ),
        datasets: [
          {
            label: message.author.username,
            lineTension: 0.1,
            data: datasets.map((dataset) => dataset.count),
          },
        ],
      },
    };

    const { data } = await axios.post("https://quickchart.io/chart/create", {
      backgroundColor: "white",
      chart,
    });

    message.channel.send({
      files: [
        {
          attachment: data.url,
          name: "total.png",
        },
      ],
    });
  } catch (error) {
    console.log("Sending weekly shitters failed", error);
  }
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

function formatShitters(shitters: Entry[]): string {
  return shitters
    .map(
      (shitter, index) =>
        `${index + 1}. ${shitter.author.username}, ${shitter.count} times 💩`
    )
    .join("\n");
}

function getFirstAndLast(shitters) {
  const { length, [length - 1]: last } = shitters;
  return [shitters[0], last];
}

function formatMessage(shitters: Entry[], configs): string {
  const [first, last] = getFirstAndLast(shitters);
  console.log(first.created);
  return `\`\`\`Top ${configs?.unit || "total"} shitters:\n${formatShitters(
    shitters
  )}\n\nTotal ${total(shitters)} shits taken 🚀🚽 \`\`\``;
}

function total(shitters: Entry[]) {
  return shitters.reduce((acc, shitter) => (acc += shitter.count || 0), 0);
}

function formatUnits() {
  return `Units:\n\t${Object.values(units).join("\n\t")}`;
}

function formatCommands() {
  return `Commands:\n\t${Object.values(commands).join("\n\t")}`;
}

function formatTypes() {
  return `Types:\n\t${Object.values(types).join("\n\t")}`;
}

const helpText = `You can use units, commands and types in order you wish, for example: \n\t!raftbot weekly top \n\t!rafbot top week\n\t!raftbot daily pie`;

export async function sendHelp(message) {
  message.channel.send(
    `\`\`\`Usage 🧑‍💻\n${formatUnits()}\n${formatUnits()}\n${formatCommands()}\n${formatTypes()}\n${helpText}\`\`\``
  );
}
