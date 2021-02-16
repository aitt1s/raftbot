import {
  PeriodToFrequency,
  periods,
  metrics,
  groupings,
  types,
  rollingPeriods,
  staticPeriods,
  commands,
  Command,
  intervalGroupings,
  intervalGroupingsToNormal,
} from "../types/Raftbot";
import { DateTime, Interval } from "luxon";
import RRule from "rrule";

export class InputConfig {
  period: string;
  metric: string;
  grouping: string;
  type: string;

  start: DateTime;
  end: DateTime;

  comparisonStart: DateTime;
  comparisonEnd: DateTime;

  interval: Interval;

  defaultCommand: Command = {
    period: "day",
    metric: "shits",
    grouping: "user",
    type: "top",
  };

  intervalGrouping: boolean = false;

  constructor() {}

  private createIntervals(period: string): void {
    const dateTime: DateTime = DateTime.local().setZone(
      process.env.TZ || "Europe/Helsinki"
    );

    if (staticPeriods.includes(period)) {
      this.start = dateTime.startOf(mapPeriodToLuxonUnit(period));
      this.end = dateTime;

      this.comparisonStart = this.start.minus({
        [mapPeriodToLuxonUnit(period)]: 1,
      });

      this.comparisonEnd = this.end
        .minus({
          [mapPeriodToLuxonUnit(period)]: 1,
        })
        .endOf(mapPeriodToLuxonUnit(period));
    }

    if (rollingPeriods.includes(period)) {
      this.start = dateTime.minus({ [mapPeriodToLuxonUnit(period)]: 1 });
      this.end = dateTime;

      this.comparisonStart = this.start.minus({
        [mapPeriodToLuxonUnit(period)]: 1,
      });

      this.comparisonEnd = this.end.minus({
        [mapPeriodToLuxonUnit(period)]: 1,
      });
    }

    this.interval = Interval.fromDateTimes(this.start, this.end);
  }

  private splitInput(input, override = false): string[] {
    const inputString = input.trim().toLowerCase();

    if (!inputString) return [];

    // match command
    const isCommand: Command = commands[inputString];

    if (isCommand) {
      return [...Object.values(isCommand)];
    } else {
      throw "unkown";
    }

    return inputString.split(" ");
  }

  public fromInput(input: string): InputConfig {
    try {
      const {
        period: defaultPeriod,
        metric: defaultMetric,
        grouping: defaultGrouping,
        type: defaultType,
      } = this.defaultCommand;
      const [period, metric, grouping, type] = this.splitInput(input);

      // !raftbot <period>  <metric>  <grouping>  <type>
      // !raftbot weekly    shits     user        top
      // !raftbot month     shits     hour        bar
      // !raftbot week      me        day         bar

      this.period = periods.includes(period) ? period : defaultPeriod;
      this.metric = metrics.includes(metric) ? metric : defaultMetric;
      this.grouping = groupings.includes(grouping) ? grouping : defaultGrouping;
      this.type = types.includes(type) ? type : defaultType;

      if (intervalGroupings.includes(this.grouping)) {
        this.intervalGrouping = true;
        this.grouping = intervalGroupingsToNormal[this.grouping];
      }

      if (this.period) {
        this.createIntervals(this.period);
      }

      return this;
    } catch (error) {
      throw error;
    }
  }

  public datesBetween(): DateTime[] {
    if (!this.start || !this.end) {
      throw new Error("Start or end must be defined");
    }

    const rule = new RRule({
      freq: PeriodToFrequency[mapPeriodToLuxonUnit(this.grouping)],
      dtstart: this.start.toJSDate(),
      until: this.end.toJSDate(),
    });

    return rule.all().map((date) => DateTime.fromJSDate(date));
  }

  public getDates() {
    let data = {};
    this.datesBetween().forEach(
      (date) => (data[getLabelForGrouping(date, this.grouping)] = 0)
    );

    return data;
  }

  public getInterval() {
    const rule = new RRule({
      freq: PeriodToFrequency[mapPeriodToLuxonUnit(this.grouping)],
      dtstart: this.start.toJSDate(),
      until: this.end.toJSDate(),
    });

    let dates = rule.all().sort((a, b) => {
      const aDate = DateTime.fromJSDate(a);
      const bDate = DateTime.fromJSDate(b);

      return (
        aDate[mapLuxonNumbers(this.grouping)] -
        bDate[mapLuxonNumbers(this.grouping)]
      );
    });

    let data = {};

    dates.forEach((date) => {
      const dateTime = DateTime.fromJSDate(date);
      const label = dateTime[mapLuxonGetter(this.grouping)];
      if (!data[label]) {
        data[label] = 0;
      }
    });

    return data;
  }
}

function mapLuxonNumbers(grouping) {
  switch (grouping) {
    case "hourly":
    case "hour":
      return "hour";

    case "daily":
    case "day":
      return "weekday";

    case "weekly":
    case "week":
      return "weekNumber";

    case "monthly":
    case "month":
      return "month";

    default:
      break;
  }
}

export function mapPeriodToLuxonUnit(period) {
  switch (period) {
    case "minute":
    case "minutely":
    case "rolling-minute":
      return "minute";

    case "hour":
    case "hourly":
    case "rolling-hour":
      return "hour";

    case "day":
    case "daily":
    case "rolling-day":
      return "day";

    case "week":
    case "weekly":
    case "rolling-week":
      return "week";

    case "month":
    case "monthly":
    case "rolling-month":
      return "month";

    case "quarter":
    case "quarterly":
    case "rolling-quarter":
      return "quarter";

    case "year":
    case "yearly":
    case "rolling-year":
      return "year";

    default:
      return "week";
  }
}

export function getLabelForGrouping(dateTime, grouping) {
  switch (grouping) {
    case "minute":
    case "minutely":
    case "rolling-minute":
      return dateTime.toFormat("mm");

    case "hour":
    case "hourly":
    case "rolling-hour":
      return dateTime.toFormat("HH");

    case "day":
    case "daily":
    case "rolling-day":
      return dateTime.toFormat("dd.MM");

    case "week":
    case "weekly":
    case "rolling-week":
      return dateTime.toFormat("WW");

    case "month":
    case "monthly":
    case "rolling-month":
      return dateTime.toFormat("LLL");

    case "quarter":
    case "quarterly":
    case "rolling-quarter":
      return dateTime.toFormat("qq");

    case "year":
    case "yearly":
    case "rolling-year":
      return dateTime.toFormat("kkkk");

    default:
      return "week";
  }
}

export function mapLuxonGetter(grouping) {
  switch (grouping) {
    case "minutely":
    case "minute":
      return "minute";

    case "hourly":
    case "hour":
      return "hour";

    case "daily":
    case "day":
      return "weekdayLong";

    case "weekly":
    case "week":
      return "weekNumber";

    case "monthly":
    case "month":
      return "month";

    default:
      break;
  }
}
