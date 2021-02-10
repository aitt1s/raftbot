import { firestore } from "firebase-admin";
import { DateTime } from "luxon";

export enum FirebaseStructure {
  ENTRIES = "entries",
  LIKES = "likes",
  GUILDS = "guilds",
}

export enum Command {
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  ATH = "ATH",
  DAILY = "DAILY",
  WEEKLY_CALENDAR = "WEEKLY_CALENDAR",
  MONTHLY_ME = "MONTHLY_ME",
  WEEKLY_ME = "WEEKLY_ME",
  DAILY_ME = "DAILY_ME",
  HELP = "HELP",
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
