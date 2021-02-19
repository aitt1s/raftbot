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

export async function handleCronTask(guild, content): Promise<void> {
  try {
    const configs = await new InputConfig().fromInput(content);

    const snapshot = await getEntries(guild, configs);
    const grouped = groupEntries(snapshot, configs);

    await sendToChannel(guild, grouped, configs);

    const user = grouped?.current?.[0].author?.username;

    if (user) {
      await guild.channel.send(
        `\`\`\`Congratulations to the daily hardest shitter:\n\n💩💩💩💩💩💩\n\n\t${user}\n\n💩💩💩💩💩💩\n\nHe shitted ${grouped?.current?.[0].count} times!\`\`\``
      );
    }
  } catch (error) {
    console.log("error handling the command");
  }
}
