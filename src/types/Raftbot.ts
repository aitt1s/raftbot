import { firestore } from "firebase-admin";

export enum FirebaseStructure {
  ENTRIES = "entries",
  LIKES = "likes",
  GUILDS = "guilds",
}

export enum Command {
  WEEKLY = "WEEKLY",
  ATH = "ATH",
  DAILY = "DAILY",
  WEEKLY_CALENDAR = "WEEKLY_CALENDAR",
}

export interface Author {
  id: string;
  username: string;
}

export interface Entry {
  messageId: string;
  author: Author;
  created?: firestore.Timestamp;
  count?: number;
}
