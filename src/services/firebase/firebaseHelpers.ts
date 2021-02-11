import { firestore } from "firebase-admin";
import { DateTime } from "luxon";
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

export function sortEntriesByAction(snapshot, configs) {
  if (configs.command === "me") {
    return sortMyShits(snapshot, configs);
  }

  if (configs.command === "total") {
    return sortTotalShits(snapshot, configs);
  }

  return sortTopShitters(snapshot);
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
  configs
): Dateset[] {
  const start = startOf(configs.unit || "month");
  const days = numberOfDays(start, configs.unit || "month");

  const generatedDates = generateDates({
    start: start.toJSDate(),
    freq: Frequency.DAILY,
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
  configs
): Dateset[] {
  const start = startOf(configs.unit || "month");
  const days = numberOfDays(start, configs.unit || "month");

  const generatedDates = generateDates({
    start: start.toJSDate(),
    freq: Frequency.DAILY,
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
