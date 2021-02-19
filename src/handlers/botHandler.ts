import { Message } from "discord.js";
import { InputConfig } from "./inputConfig";
import { getEntries } from "../services/firebase";
import { sendToChannel, sendHelp } from "../services/bot";
import { groupEntries } from "../services/firebase/firebaseHelpers";

// !raftbot <period> <metric> <grouping>

export async function handleBotCommand(message: Message): Promise<void> {
  try {
    const prefix: string = "!raftbot";
    const content = message.content.slice(prefix.length);

    if (content.includes("help")) {
      await sendHelp(message);
      return;
    }

    const configs = await new InputConfig().fromInput(content);

    const snapshot = await getEntries(message, configs);
    const grouped = groupEntries(snapshot, configs);

    await sendToChannel(message, grouped, configs);
  } catch (error) {
    if (error === "not_valid_command") return await sendHelp(message, error);
    console.log(error);

    console.log("error handling the command");
  }
}
