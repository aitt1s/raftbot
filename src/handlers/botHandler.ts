import { Message } from "discord.js";
import { CommandConfig } from "../types/Raftbot";
import { getEntries } from "../services/firebase";
import { sendToChannel, sendHelp } from "../services/bot";
import { normalize } from "../helpers/normalizers";
import { sortEntriesByAction } from "../services/firebase/firebaseHelpers";

let prefix: string = "!raftbot";

export async function handleBotCommand(message: Message): Promise<void> {
  const contentString = message.content
    .slice(prefix.length)
    .trim()
    .replace("-", " ")
    .toLowerCase();

  const contentArguments = contentString.split(" ");

  const configs: CommandConfig = {};
  const found = [];

  for (const argument of contentArguments) {
    ["unit", "command", "type"].forEach((config) => {
      const value = normalize[config](argument);

      if (value) {
        configs[config] = value;
        found.push(argument);
      }
    });
  }

  if (!found.length) {
    message.channel.send("Did not found any valid commands 🧐");
    return;
  }

  const notFound = contentArguments.filter((item) => found.indexOf(item) < 0);

  if (notFound.length > 0) {
    message.channel.send(`Found unknown commands: ${notFound.join(", ")} 😥`);
  }

  if (configs.command === "help") {
    await sendHelp(message);
    return;
  }

  const snapshot = await getEntries(message, configs);
  const sorted = sortEntriesByAction(snapshot, configs);
  await sendToChannel(message, sorted, configs);
}
