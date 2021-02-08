import { Message } from "discord.js";
import { Command } from "../types/Raftbot";
import {
  getATHShitters,
  getWeeklyShitters,
  getDailyShitters,
  getWeeklyEntries,
  getMyEntries,
} from "../services/firebase";
import {
  sendTopShitters,
  sendWeeklyShitters,
  sendDailyShitters,
  sendWeeklyCalendar,
  sendPersonalCalendar,
  sendUknownCommand,
} from "../services/bot";

const mapCommand = {
  ATH: "ath-shitters",
  WEEKLY: "weekly-shitters",
  DAILY: "daily-shitters",
  WEEKLY_CALENDAR: "weekly-calendar",
  ME: "me",
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

    await sendWeeklyShitters(channel, shitters);
    return;
  }

  if (tryCommand(content, mapCommand[Command.DAILY])) {
    const shitters = await getDailyShitters(guildId);

    await sendDailyShitters(channel, shitters);
    return;
  }

  if (tryCommand(content, mapCommand[Command.WEEKLY_CALENDAR])) {
    const datasets = await getWeeklyEntries(guildId);

    await sendWeeklyCalendar(channel, datasets);
    return;
  }

  if (tryCommand(content, mapCommand[Command.ME])) {
    const datasets = await getMyEntries(guildId, message.author.id);

    await sendPersonalCalendar(message, datasets);
    return;
  }

  await sendUknownCommand(channel);
}

function tryCommand(content: Message["content"], command: string): boolean {
  return content.toLowerCase().includes(command);
}
