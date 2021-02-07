import { Message } from "discord.js";
import { Entry, Command } from "../types/Raftbot";
import axios from "axios";
import { DateTime } from "luxon";
import { firestore } from "firebase-admin";

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

type Dataset = {
  timestamp: number;
  day: string;
  count: number;
};

export async function sendWeeklyCalendar(
  channel: Message["channel"],
  shitters: firestore.QuerySnapshot
): Promise<void> {
  try {
    let datasets: Dataset[] = [];

    shitters.forEach((doc) => {
      const entry = doc.data();
      const date = DateTime.fromSeconds(entry.created.seconds);

      const dayIdx = datasets.findIndex(
        (datasetEntry: Dataset) => datasetEntry.day === date.weekdayLong
      );

      if (dayIdx > -1) {
        datasets[dayIdx].count += 1;
      } else {
        datasets.push({
          timestamp: entry.created.seconds,
          day: date.weekdayLong,
          count: 1,
        });
      }
    });

    let chartConfig = {
      type: "bar",
      data: {
        labels: datasets.map((dataset) => dataset.day),
        datasets: [
          { label: "Total", data: datasets.map((dataset) => dataset.count) },
        ],
      },
    };

    datasets.sort((a, b) => b.timestamp - a.timestamp);

    const { data } = await axios.post("https://quickchart.io/chart/create", {
      backgroundColor: "white",
      chart: chartConfig,
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
