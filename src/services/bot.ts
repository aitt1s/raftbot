import { Message } from "discord.js";
import { Entry, Command } from "../types/Raftbot";

export const sendTopShitters: (
  channel: Message["channel"],
  shitters: Entry[]
) => void = (channel, shitters) => {
  try {
    channel.send(formatMessage(Command.ATH, shitters));
  } catch (error) {
    console.log("Sending ATH shitters failed", error);
  }
};

export const sendWeekShitters: (
  channel: Message["channel"],
  shitters: Entry[]
) => void = (channel, shitters) => {
  try {
    channel.send(formatMessage(Command.WEEKLY, shitters));
  } catch (error) {
    console.log("Sending weekly shitters failed", error);
  }
};

export const sendDailyShitters: (
  channel: Message["channel"],
  shitters: Entry[]
) => void = (channel, shitters) => {
  try {
    channel.send(formatMessage(Command.DAILY, shitters));
  } catch (error) {
    console.log("Sending daily shitters failed", error);
  }
};

export const sendUknownCommand: (channel: Message["channel"]) => void = (
  channel
) => {
  try {
    channel.send("Uknown command :(");
  } catch (error) {
    console.log("Sending unknown command error failed", error);
  }
};

export const reactMessage: (
  message: Message,
  emoji: string
) => Promise<void> = async (message, emoji) => {
  try {
    message.react(emoji);
  } catch (error) {
    console.log("Sending react failed", error);
  }
};

const formatShitters: (shitters: Entry[]) => string = (shitters) =>
  shitters
    .map(
      (shitter, index) =>
        `${index + 1}. ${shitter.author.username}, ${shitter.count} times 💩`
    )
    .join("\n");

const formatMessage: (command: Command, shitters: Entry[]) => string = (
  command,
  shitters
) => `\`\`\`Top ${command} shitters:\n${formatShitters(shitters)}\`\`\``;
