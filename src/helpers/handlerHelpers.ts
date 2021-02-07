import { Message } from "discord.js";

export function isPoopEntry(message: Message): boolean {
  const poopTriggers: RegExp[] = [/\bhep\b/, /💩/];
  const content = message.content.toLowerCase();

  return poopTriggers.some((trigger) => content.match(trigger));
}

export function isBotCommand({ content }: { content: string }): boolean {
  return content?.startsWith("!raftbot");
}
