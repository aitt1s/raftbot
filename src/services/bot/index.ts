import { Message } from "discord.js";
import { Entry, Command, Dateset } from "../../types/Raftbot";
import axios from "axios";

export async function sendTopShitters(
  channel: Message["channel"],
  shitters: Entry[]
): Promise<void> {
  try {
    await channel.send(formatMessage(Command.ATH, shitters));
  } catch (error) {
    console.log("Sending ATH shitters failed", error);
  }
}

export async function sendWeeklyShitters(
  channel: Message["channel"],
  shitters: Entry[]
): Promise<void> {
  try {
    channel.send(formatMessage(Command.WEEKLY, shitters));
  } catch (error) {
    console.log("Sending weekly shitters failed", error);
  }
}

export async function sendDailyShitters(
  channel: Message["channel"],
  shitters: Entry[]
): Promise<void> {
  try {
    channel.send(formatMessage(Command.DAILY, shitters));
  } catch (error) {
    console.log("Sending daily shitters failed", error);
  }
}

export async function sendWeeklyCalendar(
  channel: Message["channel"],
  datasets: Dateset[]
): Promise<void> {
  try {
    const chart = {
      type: "bar",
      data: {
        labels: datasets.map((dataset) => dataset.date.weekdayLong),
        datasets: [
          { label: "Total", data: datasets.map((dataset) => dataset.count) },
        ],
      },
    };

    const { data } = await axios.post("https://quickchart.io/chart/create", {
      backgroundColor: "white",
      chart,
    });

    channel.send({
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

export async function sendPersonalCalendar(
  message: Message,
  datasets: Dateset[]
): Promise<void> {
  try {
    const chart = {
      type: "line",
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
            lineTension: 0.4,
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

export async function sendUknownCommand(
  channel: Message["channel"]
): Promise<void> {
  try {
    channel.send("Uknown command :(");
  } catch (error) {
    console.log("Sending unknown command error failed", error);
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

function formatMessage(command: Command, shitters: Entry[]): string {
  return `\`\`\`Top ${command} shitters:\n${formatShitters(shitters)}\`\`\``;
}
