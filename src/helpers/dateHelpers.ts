import { DateTime, DurationUnit } from "luxon";
import { RRule, Frequency } from "rrule";
import { normalize } from "../helpers/normalizers";

type DateConfig = {
  count?: number;
  end?: Date;
  freq?: Frequency;
  start?: Date;
};

export function generateDates({
  count = 7,
  end = null,
  freq = RRule.DAILY,
  start = new Date(),
}: DateConfig = {}): Date[] {
  if (!count && !end) {
    throw new Error("Count or end must be defined");
  }

  const rule = new RRule({
    freq,
    dtstart: start,
    until: end,
    count,
  });

  return rule.all();
}

export function nowWithTz(): DateTime {
  return DateTime.local().setZone(process.env.TZ || "Europe/Helsinki");
}

export function startOf(unit: string | DurationUnit): DateTime {
  if (normalize.startOf(unit)) {
    return nowWithTz().minus({ [normalize.toLuxonUnit(unit)]: 1 });
  } else {
    return nowWithTz().startOf(normalize.toLuxonUnit(unit) as DurationUnit);
  }
}

export function numberOfDays(date: DateTime, unit: string): number {
  switch (normalize.toLuxonUnit(unit)) {
    case "day":
      return 1;

    case "week":
      return 7;

    case "month":
      return date.daysInMonth;

    case "year":
      return date.daysInYear;

    default:
      throw new Error("Invalid time unit");
  }
}
