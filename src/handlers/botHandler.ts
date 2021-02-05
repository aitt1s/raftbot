import { Message } from "discord.js";
import { Command } from "../types/Raftbot";
import {
  getAllShitters,
  getWeekShitters,
  getDailyShitters,
} from "../services/firebase";
import {
  sendTopShitters,
  sendWeekShitters,
  sendDailyShitters,
  sendUknownCommand,
} from "../services/bot";

const mapCommand = {
  ATH: "ath-shitters",
  WEEKLY: "weekly-shitters",
  DAILY: "daily-shitters",
};

export const handleBotCommand: (message: Message) => Promise<void> = async (
  message
) => {
  const { content, channel } = message;
  if (tryCommand(content, mapCommand[Command.ATH])) {
    const shitters = await getAllShitters();

    await sendTopShitters(channel, shitters);
    return;
  }

  if (tryCommand(content, mapCommand[Command.WEEKLY])) {
    const shitters = await getWeekShitters();

    await sendWeekShitters(channel, shitters);
    return;
  }

  if (tryCommand(content, mapCommand[Command.DAILY])) {
    const shitters = await getDailyShitters();

    await sendDailyShitters(channel, shitters);
    return;
  }

  await sendUknownCommand(channel);
};

const tryCommand: (content: Message["content"], command: string) => boolean = (
  content,
  command
) => content.toLowerCase().includes(command);
