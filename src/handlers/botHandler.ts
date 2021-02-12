import { Message } from "discord.js";
import { Dateset, InputCommand } from "../types/Raftbot";
import { InputConfig } from "./inputConfig";
import { getEntries } from "../services/firebase";
import { sendToChannel, sendHelp } from "../services/bot";
import { sortEntriesByAction } from "../services/firebase/firebaseHelpers";

export async function handleBotCommand(message: Message): Promise<void> {
  const configs = new InputConfig().fromInput(message.content);
  if (configs.command === InputCommand.HELP) {
    await sendHelp(message);
    return;
  }

  const snapshot = await getEntries(message, configs);
  const sorted: Dateset[] = sortEntriesByAction(snapshot, configs);
  await sendToChannel(message, sorted, configs);
}
