import { firestore } from "firebase-admin";
import { DateTime, DurationUnit } from "luxon";
import { Entry, FirebaseStructure, Dateset } from "../../types/Raftbot";
import {
  generateDates,
  startOf,
  numberOfDays,
} from "../../helpers/dateHelpers";

import { Frequency } from "rrule";

DateTime.local().setZone(process.env.TZ || "Europe/Helsinki");

export function getCollectinRef(
  guildId: string,
  collection: FirebaseStructure
): firestore.CollectionReference<firestore.DocumentData> {
  return firestore()
    .collection(FirebaseStructure.GUILDS)
    .doc(guildId)
    .collection(collection);
}

export function sortTopShitters(snapshot: firestore.QuerySnapshot): Entry[] {
  let shitters = [];

  snapshot.forEach((doc) => {
    const entry = doc.data();

    const shitterIdx = shitters.findIndex(
      (shitter) => shitter.author.id === entry?.author?.id
    );

    if (shitterIdx > -1) {
      shitters[shitterIdx].count += 1;
      return;
    }

    if (entry?.author?.id) {
      shitters.push({
        ...entry,
        count: 1,
      });
    }
  });

  shitters.sort((a, b) => b.count - a.count);

  return shitters;
}

export function sortTotalShits(
  snapshot: firestore.QuerySnapshot,
  {
    unit = "week",
    freq = Frequency.WEEKLY,
  }: {
    unit: DurationUnit;
    freq: Frequency;
  }
): Dateset[] {
  const start = startOf(unit);
  const days = numberOfDays(start, unit);

  const generatedDates = generateDates({
    start: start.toJSDate(),
    freq,
    count: days,
  });

  let datesets: Dateset[] = generatedDates.map((date) => ({
    date: DateTime.fromJSDate(date),
    count: 0,
  }));

  snapshot.forEach((doc) => {
    const entry = doc.data();
    const docDate = DateTime.fromSeconds(entry.created.seconds);

    const dayIdx = datesets.findIndex((datasetEntry: Dateset) =>
      datasetEntry.date.hasSame(docDate, "day")
    );

    if (dayIdx > -1) {
      datesets[dayIdx].count += 1;
    }
  });

  return datesets;
}

export function sortMyShits(
  snapshot: firestore.QuerySnapshot,
  {
    unit = "week",
    freq = Frequency.WEEKLY,
  }: {
    unit: DurationUnit;
    freq: Frequency;
  }
): Dateset[] {
  const start = startOf(unit);
  const days = numberOfDays(start, unit);

  const generatedDates = generateDates({
    start: start.toJSDate(),
    freq,
    count: days,
  });

  let datesets: Dateset[] = generatedDates.map((date) => ({
    date: DateTime.fromJSDate(date),
    count: 0,
  }));

  snapshot.forEach((doc) => {
    const entry = doc.data();
    const docDate = DateTime.fromSeconds(entry.created.seconds);

    const dayIdx = datesets.findIndex((datasetEntry: Dateset) =>
      datasetEntry.date.hasSame(docDate, "day")
    );

    if (dayIdx > -1) {
      datesets[dayIdx].count += 1;
    }
  });

  return datesets;
}
