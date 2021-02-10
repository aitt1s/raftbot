import { Message } from "discord.js";
import { Command } from "../types/Raftbot";
import {
  getATHShitters,
  getTopShitters,
  getDailyShitters,
  getTotalShits,
  getMyShits,
} from "../services/firebase";
import {
  sendTopShitters,
  sendWeeklyShitters,
  sendDailyShitters,
  sendWeeklyCalendar,
  sendPersonalCalendar,
  sendCommands,
  sendUknownCommand,
} from "../services/bot";
import { Frequency } from "rrule";

export const mapCommand = {
  ATH: "ath-shitters",
  MONTHLY: "monthly-shitters",
  WEEKLY: "weekly-shitters",
  DAILY: "daily-shitters",
  WEEKLY_CALENDAR: "weekly-calendar",
  MONTHLY_ME: "monthly-me",
  WEEKLY_ME: "weekly-me",
  DAILY_ME: "daily-me",
  HELP: "help",
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
    const shitters = await getTopShitters(guildId, { unit: "week" });

    await sendWeeklyShitters(channel, shitters);
    return;
  }

  if (tryCommand(content, mapCommand[Command.DAILY])) {
    const shitters = await getTopShitters(guildId, { unit: "day" });

    await sendDailyShitters(channel, shitters);
    return;
  }

  if (tryCommand(content, mapCommand[Command.MONTHLY])) {
    const shitters = await getTopShitters(guildId, { unit: "month" });

    await sendDailyShitters(channel, shitters);
    return;
  }

  if (tryCommand(content, mapCommand[Command.WEEKLY_CALENDAR])) {
    const datasets = await getTotalShits(guildId, {
      unit: "week",
      freq: Frequency.DAILY,
    });

    await sendWeeklyCalendar(channel, datasets);
    return;
  }

  if (tryCommand(content, mapCommand[Command.DAILY_ME])) {
    const datasets = await getMyShits(guildId, message.author.id, {
      unit: "day",
      freq: Frequency.DAILY,
    });

    await sendPersonalCalendar(message, datasets, { unit: "day" });
    return;
  }

  if (tryCommand(content, mapCommand[Command.WEEKLY_ME])) {
    const datasets = await getMyShits(guildId, message.author.id, {
      unit: "week",
      freq: Frequency.DAILY,
    });

    await sendPersonalCalendar(message, datasets, { unit: "day" });
    return;
  }

  if (tryCommand(content, mapCommand[Command.MONTHLY_ME])) {
    const datasets = await getMyShits(guildId, message.author.id, {
      unit: "month",
      freq: Frequency.DAILY,
    });

    await sendPersonalCalendar(message, datasets, { unit: "day" });
    return;
  }

  if (tryCommand(content, mapCommand[Command.HELP])) {
    await sendCommands(message, mapCommand);
    return;
  }

  await sendUknownCommand(channel);
}

function tryCommand(content: Message["content"], command: string): boolean {
  return content.toLowerCase().includes(command);
}
