import { Message } from "discord.js";

export const isPoopEntry = (message: Message): boolean => {
  const poopTriggers: RegExp[] = [/\bhep\b/, /💩/];
  const content = message.content.toLowerCase();

  return poopTriggers.some(trigger => content.match(trigger));
};

export const isBotCommand: ({ content }: { content: string }) => boolean = ({
  content,
}) => content?.startsWith("!raftbot");
