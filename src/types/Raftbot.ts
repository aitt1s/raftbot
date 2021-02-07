export enum FirebaseStructure {
  ENTRIES = "entries",
  LIKES = "likes",
  GUILDS = "guilds",
}

export enum Command {
  WEEKLY = "WEEKLY",
  ATH = "ATH",
  DAILY = "DAILY",
}

export interface Author {
  id: string;
  username: string;
}

export interface Entry {
  messageId: string;
  author: Author;
  created?: string;
  count?: number;
}
