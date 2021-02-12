import {
  InputUnit,
  InputCommand,
  InputType,
  PeriodUnits,
  RollingUnits,
  RollingToLuxonDurationUnit,
  UnitToFrequency,
  InputFrequency,
  FrequencyOverride,
  Dateset,
} from "../types/Raftbot";
import { DateTime, Interval } from "luxon";
import RRule from "rrule";

export class InputConfig {
  unit: PeriodUnits | RollingUnits = PeriodUnits.WEEK;
  command: InputCommand = InputCommand.TOP;
  type: InputType = InputType.LIST;
  frequency: InputFrequency;
  prefix: string = "!raftbot";
  hasInputErrors: boolean = false;
  inputErrors: string[] = [];
  dateTime: DateTime = DateTime.local().setZone(
    process.env.TZ || "Europe/Helsinki"
  );
  start: DateTime;
  end: DateTime;
  interval: Interval;
  smallUnits: boolean = false;

  constructor() {}

  private createIntervals(): void {
    if (this.unit in PeriodUnits)
      this.start = this.dateTime.startOf(PeriodUnits[this.unit]);
    else if (this.unit in RollingUnits) {
      this.start = this.dateTime.minus({
        [RollingToLuxonDurationUnit[this.unit]]: 1,
      });
    }

    this.end = this.dateTime;
    this.interval = Interval.fromDateTimes(this.start, this.end);
  }

  private splitInput(input): string[] {
    const inputString = input.slice(this.prefix.length).trim().toUpperCase();

    return inputString.split(" ");
  }

  public fromInput(input: string): InputConfig {
    const inputs = this.splitInput(input);

    inputs.forEach((i: string) => {
      if (i in InputUnit) this.unit = InputUnit[i];
      else if (InputCommand[i]) this.command = InputCommand[i];
      else if (InputType[i]) this.type = InputType[i];
      else if (InputFrequency[i]) this.frequency = InputFrequency[i];
      else {
        this.hasInputErrors = true;
        this.inputErrors = [...this.inputErrors, i];
      }
    });

    if (this.unit) {
      this.createIntervals();

      if (!this.frequency) {
        this.frequency = UnitToFrequency[this.unit];
      }

      const smallFrequencies = [
        InputFrequency["BY-MINUTES"],
        InputFrequency["BY-HOURS"],
      ];

      const smallUnits = [
        RollingUnits.HOURLY,
        RollingUnits.DAILY,
        PeriodUnits.HOUR,
        PeriodUnits.DAY,
      ];

      if (
        smallFrequencies.includes(this.frequency) ||
        smallUnits.includes(this.unit)
      ) {
        this.smallUnits = true;
      }
    }

    return this;
  }

  public datesBetween(): DateTime[] {
    if (!this.end) {
      throw new Error("Count or end must be defined");
    }

    const rule = new RRule({
      freq:
        (this.frequency && FrequencyOverride[this.frequency]) ||
        UnitToFrequency[this.unit],
      dtstart: this.start.toJSDate(),
      until: this.end.toJSDate(),
    });

    return rule.all().map((date) => DateTime.fromJSDate(date));
  }

  public getDatesets(): Dateset[] {
    return this.datesBetween().map((date) => ({
      date,
      count: 0,
    }));
  }
}
