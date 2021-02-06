import { Message, MessageReaction } from "discord.js";
import { EntryType } from "../types/Raftbot";
import { addEntry } from "../services/firebase";
import { isBotCommand, isPoopEntry } from "../helpers/handlerHelpers";
import { handleBotCommand } from "../handlers/botHandler";
import { reactMessage } from "../services/bot";

export const handleMessage: (message: Message) => Promise<void> = async (
  message
) => {
  if (message.author.bot) return;

  if (isBotCommand(message)) {
    await handleBotCommand(message);
    return;
  }

  if (isPoopEntry(message)) {
    await addEntry(message.guild.id, {
      type: EntryType.CREATE,
      messageId: message.id,
      author: {
        id: message.author.id,
        username: message.author.username,
      },
    });

    await reactMessage(message, "✅");
  }
};

export const handleReaction: (
  reaction: MessageReaction
) => Promise<void> = async (reaction) => {
  if (reaction.me) return;

  const { message } = reaction;

  if (isPoopEntry(message)) {
    addEntry(message.guild.id, {
      type: EntryType.LIKE,
      messageId: message.id,
      author: {
        id: message.author.id,
        username: message.author.username,
      },
    });
  }
};

export const handleReady: () => void = () => {
  console.log("Bot connected");
};
