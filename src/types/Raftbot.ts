import { firestore } from "firebase-admin";
import { DateTime } from "luxon";
import { Frequency } from "rrule";

export enum InputCommand {
  MY = "MY",
  TOTAL = "TOTAL",
  TOP = "TOP",
  HELP = "HELP",
}

export enum InputType {
  LIST = "LIST",
  PIE = "PIE",
  BAR = "BAR",
  LINE = "LINE",
  RADAR = "RADAR",
  POLARAREA = "POLARAREA",
}

export enum RollingUnits {
  HOURLY = "HOURLY",
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  QUARTLY = "QUARTLY",
  YEARLY = "YEARLY",
}

export enum PeriodUnits {
  HOUR = "HOUR",
  DAY = "DAY",
  WEEK = "WEEK",
  MONTH = "MONTH",
  QUARTER = "QUERTER",
  YEAR = "YEAR",
}

export const InputUnit = { ...RollingUnits, ...PeriodUnits };
export type InputUnit = typeof InputUnit;

export enum InputFrequency {
  "BY-MINUTES" = "MINUTE",
  "BY-HOURS" = "HOUR",
  "BY-DAYS" = "DAY",
  "BY-WEEKS" = "WEEK",
  "BY-MONTHS" = "MONTH",
  "BY-QUARTERS" = "QUARTER",
  "BY-YEARS" = "YEAR",
}

export const FrequencyToUnit = [
  "year",
  "month",
  "week",
  "day",
  "hour",
  "minute",
];

export const FrequencyOverride = {
  MINUTE: Frequency.MINUTELY,
  HOUR: Frequency.HOURLY,
  DAY: Frequency.DAILY,
  WEEK: Frequency.WEEKLY,
  MONTH: Frequency.MONTHLY,
  QUART: Frequency.MONTHLY,
  YEAR: Frequency.YEARLY,
};

export const UnitToFrequency = {
  MINUTE: Frequency.SECONDLY,
  MINUTELY: Frequency.SECONDLY,
  HOURLY: Frequency.MINUTELY,
  HOUR: Frequency.MINUTELY,
  DAILY: Frequency.HOURLY,
  DAY: Frequency.HOURLY,
  WEEKLY: Frequency.DAILY,
  WEEK: Frequency.DAILY,
  MONTHLY: Frequency.DAILY,
  MONTH: Frequency.DAILY,
  QUARTLY: Frequency.WEEKLY,
  QUARTER: Frequency.WEEKLY,
  YEARLY: Frequency.MONTHLY,
  YEAR: Frequency.MONTHLY,
};

export const RollingToLuxonDurationUnit = {
  [RollingUnits.HOURLY]: "hour",
  [RollingUnits.DAILY]: "day",
  [RollingUnits.WEEKLY]: "week",
  [RollingUnits.MONTHLY]: "month",
  [RollingUnits.QUARTLY]: "quarter",
  [RollingUnits.YEARLY]: "year",
};

export enum FirebaseStructure {
  ENTRIES = "entries",
  LIKES = "likes",
  GUILDS = "guilds",
}

export type Dateset = {
  date: DateTime;
  count?: number;
  author?: Author;
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
