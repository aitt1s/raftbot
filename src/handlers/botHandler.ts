import { Message } from "discord.js";
import { Dateset, InputCommand } from "../types/Raftbot";
import { InputConfig } from "./inputConfig";
import { getEntries } from "../services/firebase";
import { sendToChannel, sendHelp } from "../services/bot";
import { groupEntries } from "../services/firebase/firebaseHelpers";

// !raftbot <period> <metric> <grouping>

export async function handleBotCommand(message: Message): Promise<void> {
  const prefix: string = "!raftbot";
  const content = message.content.slice(prefix.length);

  if (content.includes("help")) {
    await sendHelp(message);
    return;
  }

  try {
    const configs = new InputConfig().fromInput(message.content);

    const snapshot = await getEntries(message, configs.start, configs.metric);
    const grouped = groupEntries(snapshot, configs);

    await sendToChannel(message, grouped, configs);
  } catch (error) {
    await sendHelp(message, error);
  }
}
