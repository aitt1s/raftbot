import { firestore } from "firebase-admin";
import { DateTime } from "luxon";
import { Frequency } from "rrule";

export type Command = {
  period: string;
  metric: string;
  grouping: string;
  type: string;
  comparison?: boolean;
  cumulative?: boolean;
};

export const commands = {
  "daily-pie": {
    period: "day",
    metric: "shits",
    grouping: "user",
    type: "pie",
  },
  "daily-top": {
    period: "day",
    metric: "shits",
    grouping: "user",
    type: "list",
  },
  "weekly-top": {
    period: "week",
    metric: "shits",
    grouping: "user",
    type: "list",
  },
  "weekly-pie": {
    period: "week",
    metric: "shits",
    grouping: "user",
    type: "pie",
  },
  "weekly-line": {
    period: "week",
    metric: "shits",
    grouping: "day",
    type: "line",
    comparison: true,
    cumulative: true,
  },
  "monthly-top": {
    period: "month",
    metric: "shits",
    grouping: "user",
    type: "list",
  },
  "monthly-pie": {
    period: "month",
    metric: "shits",
    grouping: "user",
    type: "pie",
  },
  "monthly-line": {
    period: "month",
    metric: "shits",
    grouping: "day",
    type: "line",
    comparison: true,
    cumulative: true,
  },
  "top-weekly-hours": {
    period: "week",
    metric: "shits",
    grouping: "by-hour",
    type: "bar",
  },
  "top-monthly-hours": {
    period: "month",
    metric: "shits",
    grouping: "by-hour",
    type: "bar",
  },
  "top-monthly-day": {
    period: "month",
    metric: "shits",
    grouping: "by-day",
    type: "bar",
  },
  "top-monthly-minute": {
    period: "month",
    metric: "shits",
    grouping: "by-minute",
    type: "line",
  },
  "my-weekly-line": {
    period: "week",
    metric: "me",
    grouping: "day",
    type: "line",
    comparison: true,
    cumulative: true,
  },
  "my-monthly-line": {
    period: "month",
    metric: "me",
    grouping: "day",
    type: "line",
    comparison: true,
    cumulative: true,
  },
};

export const intervalGroupings = ["by-minute", "by-hour", "by-day", "by-month"];

export const rollingPeriods = [
  "rolling-minute",
  "rolling-hour",
  "rolling-day",
  "rolling-week",
  "rolling-month",
  "rolling-year",
];

export const staticPeriods = [
  "minutely",
  "minute",
  "hourly",
  "hour",
  "daily",
  "day",
  "weekly",
  "week",
  "monthly",
  "month",
  "quarterly",
  "quarter",
  "yearly",
  "year",
];

export const periods = [...rollingPeriods, ...staticPeriods];

export const metrics = ["shits", "me", "my"];

export const groupings = [...periods, ...metrics, ...intervalGroupings];

export const types = ["top", "pie", "bar", "line", "radar", "polararea"];

export const smallUnits = [
  "minutely",
  "minute",
  "hourly",
  "hour",
  "daily",
  "day",
];

export enum InputCommand {
  MY = "MY",
  TOTAL = "TOTAL",
  TOP = "TOP",
  HELP = "HELP",
}

export const intervalGroupingsToNormal = {
  "by-minute": "minute",
  "by-hour": "hour",
  "by-day": "day",
  "by-month": "month",
};

export const PeriodToFrequency = {
  minute: Frequency.MINUTELY,
  hour: Frequency.HOURLY,
  day: Frequency.DAILY,
  week: Frequency.WEEKLY,
  month: Frequency.MONTHLY,
  year: Frequency.YEARLY,
};

export const PeriodToDefaultFrequency = {
  minute: Frequency.SECONDLY,
  hour: Frequency.MINUTELY,
  day: Frequency.HOURLY,
  week: Frequency.DAILY,
  month: Frequency.DAILY,
  weekly: Frequency.WEEKLY,
  year: Frequency.MONTHLY,
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

export type FirestoreEntry = {
  messageId: string;
  author: Author;
  created?: firestore.Timestamp;
  count?: number;
};

export type Entry = {
  messageId?: string;
  author?: Author;
  created?: DateTime;
  count?: number;
  comparisonCount?: number;
};

export type SortedEntries = { current: Sorted[]; comparison: Sorted[] };

export type Sorted = {
  label?: any;
  count?: number;
};
