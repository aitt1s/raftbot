import { firestore } from "firebase-admin";
import { DateTime } from "luxon";

export enum FirebaseStructure {
  ENTRIES = "entries",
  LIKES = "likes",
  GUILDS = "guilds",
}

export type Dateset = {
  date: DateTime;
  count?: number;
  username?: string;
  userId?: string;
};

export type Author = {
  id: string;
  username: string;
};

export type Entry = {
  messageId: string;
  author: Author;
  created?: firestore.Timestamp;
  count?: number;
};

export type CommandConfig = {
  unit?: string;
  command?: string;
  type?: string;
};
