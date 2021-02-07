import { Message } from "discord.js";
import { Entry, Command } from "../types/Raftbot";

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

export async function sendWeekShitters(
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

export async function sendUknownCommand(
  channel: Message["channel"]
): Promise<void> {
  try {
    channel.send("Uknown command :(");
  } catch (error) {
    console.log("Sending unknown command error failed", error);
  }
}

export async function reactMessage(
  message: Message,
  emoji: string
): Promise<void> {
  try {
    message.react(emoji);
  } catch (error) {
    console.log("Sending react failed", error);
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
