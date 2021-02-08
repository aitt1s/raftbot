import { firestore } from "firebase-admin";
import { DateTime } from "luxon";
import { Entry, FirebaseStructure, Dateset } from "../../types/Raftbot";

export function getCollectinRef(
  guildId: string,
  collection: FirebaseStructure
): firestore.CollectionReference<firestore.DocumentData> {
  return firestore()
    .collection(FirebaseStructure.GUILDS)
    .doc(guildId)
    .collection(collection);
}

export function sortByUserEntries(snapshot: firestore.QuerySnapshot): Entry[] {
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

export function sortByDailyOccurencesInWeek(
  snapshot: firestore.QuerySnapshot
): Dateset[] {
  let datesets: Dateset[] = [];

  snapshot.forEach((doc) => {
    const entry = doc.data();
    const date = DateTime.fromSeconds(entry.created.seconds);

    const dayIdx = datesets.findIndex(
      (datasetEntry: Dateset) =>
        datasetEntry.date.weekdayLong === date.weekdayLong
    );

    if (dayIdx > -1) {
      datesets[dayIdx].count += 1;
    } else {
      datesets.push({
        date,
        count: 1,
      });
    }
  });

  datesets.sort((a, b) => b.date.toMillis() - a.date.toMillis());

  return datesets;
}

export function sortByDailyOccurencesPerUser(
  snapshot: firestore.QuerySnapshot
): Dateset[] {
  let datesets: Dateset[] = [];

  snapshot.forEach((doc) => {
    const entry = doc.data();
    const date = DateTime.fromSeconds(entry.created.seconds);

    const dayIdx = datesets.findIndex((datasetEntry: Dateset) =>
      date.hasSame(datasetEntry.date, "day")
    );

    if (dayIdx > -1) {
      datesets[dayIdx].count += 1;
    } else {
      datesets.push({
        date,
        count: 1,
      });
    }
  });

  datesets.sort((a, b) => a.date.toMillis() - b.date.toMillis());

  return datesets;
}
