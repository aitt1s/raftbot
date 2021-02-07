import { Message } from "discord.js";
import { Command } from "../types/Raftbot";
import {
  getATHShitters,
  getWeeklyShitters,
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

export async function handleBotCommand(message: Message): Promise<void> {
  const {
    content,
    channel,
    guild: { id: guildId },
  } = message;
  if (tryCommand(content, mapCommand[Command.ATH])) {
    const shitters = await getATHShitters(guildId);

    await sendTopShitters(channel, shitters);
    return;
  }

  if (tryCommand(content, mapCommand[Command.WEEKLY])) {
    const shitters = await getWeeklyShitters(guildId);

    await sendWeekShitters(channel, shitters);
    return;
  }

  if (tryCommand(content, mapCommand[Command.DAILY])) {
    const shitters = await getDailyShitters(guildId);

    await sendDailyShitters(channel, shitters);
    return;
  }

  await sendUknownCommand(channel);
}

function tryCommand(content: Message["content"], command: string): boolean {
  return content.toLowerCase().includes(command);
}
