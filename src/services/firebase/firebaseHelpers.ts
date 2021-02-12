import { firestore } from "firebase-admin";
import { DateTime } from "luxon";
import {
  FirebaseStructure,
  Dateset,
  InputCommand,
  FrequencyToUnit,
} from "../../types/Raftbot";

import { InputConfig } from "../../handlers/inputConfig";

export function getCollectinRef(
  guildId: string,
  collection: FirebaseStructure
): firestore.CollectionReference<firestore.DocumentData> {
  return firestore()
    .collection(FirebaseStructure.GUILDS)
    .doc(guildId)
    .collection(collection);
}

export function sortEntriesByAction(snapshot, configs: InputConfig): Dateset[] {
  if (
    configs.command === InputCommand.MY ||
    configs.command === InputCommand.TOTAL
  ) {
    return groupByTime(snapshot, configs);
  }

  return groupByUser(snapshot);
}

export function groupByUser(snapshot: firestore.QuerySnapshot): Dateset[] {
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

export function groupByTime(
  snapshot: firestore.QuerySnapshot,
  configs: InputConfig
): Dateset[] {
  let datesets: Dateset[] = configs.getDatesets();

  snapshot.forEach((doc) => {
    const entry = doc.data();
    const docDate = DateTime.fromSeconds(entry.created.seconds);

    const dayIdx = datesets.findIndex((datasetEntry: Dateset) =>
      datasetEntry.date.hasSame(
        docDate,
        FrequencyToUnit[configs.frequency] || "day"
      )
    );

    if (dayIdx > -1) {
      datesets[dayIdx].count += 1;
    }
  });

  return datesets;
}
