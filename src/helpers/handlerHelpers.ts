import { Message } from "discord.js";

export const doesMatch: (message: Message) => boolean = (message) =>
  !!message?.content?.toLowerCase()?.match(/\bhep\b|\uD83D\uDCA9/);

export const isBotCommand: ({ content }: { content: string }) => boolean = ({
  content,
}) => content?.startsWith("!raftbot");
