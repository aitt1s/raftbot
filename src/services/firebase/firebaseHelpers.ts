import { firestore } from "firebase-admin";
import { DateTime } from "luxon";
import {
  FirebaseStructure,
  periods,
  Sorted,
  SortedEntries,
} from "../../types/Raftbot";

import {
  InputConfig,
  getLabelForGrouping,
  mapLuxonGetter,
  mapPeriodToLuxonUnit,
} from "../../handlers/inputConfig";
import { config } from "dotenv/types";

export function getCollectinRef(
  guildId: string,
  collection: FirebaseStructure
): firestore.CollectionReference<firestore.DocumentData> {
  return firestore()
    .collection(FirebaseStructure.GUILDS)
    .doc(guildId)
    .collection(collection);
}

export function groupEntries(snapshot, configs: InputConfig): SortedEntries {
  if (periods.includes(configs.grouping) && configs.intervalGrouping) {
    return groupByInterval(snapshot, configs);
  }

  if (periods.includes(configs.grouping)) {
    return groupByPeriod(snapshot, configs);
  }

  if (!periods.includes(configs.grouping)) {
    return groupByUser(snapshot, configs);
  }
}

function groupByPeriod(snapshot, configs: InputConfig): SortedEntries {
  let current = configs.getDates();
  let comparison = {};

  snapshot.current.forEach((doc) => {
    const entry = doc.data();
    const docDate = DateTime.fromSeconds(entry.created.seconds);

    const label = getLabelForGrouping(docDate, configs.grouping);

    if (current[label] >= 0) {
      current[label] += 1;
    }
  });

  if (configs.comparison) {
    comparison = configs.getDates();

    snapshot.comparison.forEach((doc) => {
      const entry = doc.data();
      const docDate = DateTime.fromSeconds(entry.created.seconds).plus({
        [mapPeriodToLuxonUnit(configs.period)]: 1,
      });

      const label = getLabelForGrouping(docDate, configs.grouping);

      if (comparison[label] >= 0) {
        comparison[label] += 1;
      }
    });
  }

  return returnObject(current, comparison, configs);
}

function groupByInterval(snapshot, configs: InputConfig): SortedEntries {
  let current = configs.getInterval();
  let comparison = current;

  snapshot.current.forEach((doc) => {
    const entry = doc.data();
    const docDate = DateTime.fromSeconds(entry.created.seconds);

    const label = docDate?.[mapLuxonGetter(configs.grouping)];

    if (current[label] >= 0) {
      current[label] += 1;
    }
  });

  return returnObject(current, comparison, configs);
}

export function groupByUser(snapshot, configs): SortedEntries {
  let current = {};
  let comparison = {};

  snapshot.current.forEach((doc) => {
    const entry = doc.data();
    const author = entry.author?.username;

    if (current[author] >= 0) {
      current[author] += 1;
    } else {
      current[author] = 1;
    }
  });

  const data = returnObject(current, comparison, configs);

  return {
    current: data.current.sort((a, b) => b.count - a.count),
    comparison: null,
  };
}

export function returnObject(current, comparison, configs) {
  return {
    current: generateDataset(current, configs),
    comparison: configs.comparison
      ? generateDataset(comparison, configs)
      : null,
  };
}

export function generateDataset(data, configs) {
  if (configs.cumulative) {
    return mapCumulative(data);
  }

  return mapDataset(data, configs);
}

export function mapDataset(data, configs) {
  return Object.keys(data).map((d) => {
    return {
      label: d,
      count: data[d],
    };
  });
}

export function mapCumulative(data) {
  let prevCount = 0;
  return Object.keys(data).reduce((acc, item) => {
    const currentItem = {
      label: item,
      count: data[item] + prevCount,
    };

    prevCount += data[item];

    return (acc = [...acc, currentItem]);
  }, []);
}
