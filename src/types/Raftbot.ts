export enum EntryType {
  CREATE = "create",
  LIKE = "like",
  UNLIKE = "unlike",
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
  type: EntryType;
  messageId: string;
  author: Author;
  created?: string;
  count?: number;
}
