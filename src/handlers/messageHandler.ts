import { Message, MessageReaction } from "discord.js";
import { addReaction, addEntry } from "../services/firebase";
import { isBotCommand, isPoopEntry } from "../helpers/handlerHelpers";
import { handleBotCommand } from "../handlers/botHandler";
import { confirmPoop } from "../services/bot";
import { schedule } from "node-cron";
import { handleCronTask } from "./botHandler";

export async function handleMessage(message: Message): Promise<void> {
  if (message.author.bot) return;

  if (isBotCommand(message)) {
    await handleBotCommand(message);
    return;
  }

  if (isPoopEntry(message)) {
    await addEntry(message.guild.id, {
      messageId: message.id,
      author: {
        id: message.author.id,
        username: message.author.username,
      },
    });

    await confirmPoop(message);
  }
}

export async function handleReaction(reaction: MessageReaction): Promise<void> {
  if (reaction.me) return;

  const { message } = reaction;

  if (isPoopEntry(message)) {
    await addReaction(message.guild.id, {
      messageId: message.id,
      author: {
        id: message.author.id,
        username: message.author.username,
      },
    });
  }
}

export function handleReady(client): void {
  const guild = client.guilds.cache.get(process.env.GUILD);
  const channel = client.channels.cache.get(process.env.CHANNEL);

  if (guild && channel) {
    schedule("59 23 * * *", async () => {
      handleCronTask(
        { guild: { id: guild.id }, channel: channel },
        "daily-top"
      );
    });
  }

  console.log("Bot connected");
}
