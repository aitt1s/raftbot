import { Message } from "discord.js";

export const isPoopEntry = (message: Message): boolean => {
  const poopTriggers = ['hep', '💩'];
  const words = message.content.toLowerCase().split(' ');

  return poopTriggers.some(trigger => words.includes(trigger));
};

export const isBotCommand: ({ content }: { content: string }) => boolean = ({
  content,
}) => content?.startsWith("!raftbot");
