import { firestore } from "firebase-admin";
import { DateTime } from "luxon";
import { FirebaseStructure, periods, Sorted } from "../../types/Raftbot";

import {
  InputConfig,
  getLabelForGrouping,
  mapLuxonGetter,
} from "../../handlers/inputConfig";

export function getCollectinRef(
  guildId: string,
  collection: FirebaseStructure
): firestore.CollectionReference<firestore.DocumentData> {
  return firestore()
    .collection(FirebaseStructure.GUILDS)
    .doc(guildId)
    .collection(collection);
}

export function groupEntries(snapshot, configs: InputConfig) {
  if (periods.includes(configs.grouping) && configs.intervalGrouping) {
    return groupByInterval(snapshot, configs);
  }

  if (periods.includes(configs.grouping)) {
    return groupByPeriod(snapshot, configs);
  }

  if (!periods.includes(configs.grouping)) {
    return groupByUser(snapshot);
  }
}

function groupByPeriod(snapshot, configs: InputConfig): Sorted[] {
  let data = configs.getDates();

  snapshot.forEach((doc) => {
    const entry = doc.data();
    const docDate = DateTime.fromSeconds(entry.created.seconds);

    const label = getLabelForGrouping(docDate, configs.grouping);

    if (data[label] >= 0) {
      data[label] += 1;
    }
  });

  return Object.keys(data).map((d) => ({
    label: d,
    count: data[d],
  }));
}

function groupByInterval(snapshot, configs: InputConfig): Sorted[] {
  let data = configs.getInterval();

  snapshot.forEach((doc) => {
    const entry = doc.data();
    const docDate = DateTime.fromSeconds(entry.created.seconds);

    const label = docDate?.[mapLuxonGetter(configs.grouping)];

    if (data[label] >= 0) {
      data[label] += 1;
    }
  });

  return Object.keys(data).map((d) => ({
    label: d,
    count: data[d],
  }));
}

export function groupByUser(snapshot): Sorted[] {
  let data = {};

  snapshot.forEach((doc) => {
    const entry = doc.data();
    const author = entry.author?.username;

    if (data[author] >= 0) {
      data[author] += 1;
    } else {
      data[author] = 1;
    }
  });

  return Object.keys(data)
    .map((d) => ({
      label: d,
      count: data[d],
    }))
    .sort((a, b) => b.count - a.count);
}
