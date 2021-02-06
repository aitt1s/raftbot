import { firestore } from "firebase-admin";
import { Entry } from "../types/Raftbot";

export const getAllShitters: (guildId: string) => Promise<Entry[]> = async (
  guildId
) => {
  try {
    const db = firestore();
    const entriesRef = db.collection(guildId).where("type", "==", "create");
    const snapshot = await entriesRef.get();

    return iterateAndSortSnapshot(snapshot);
  } catch (error) {
    console.log(error);
  }
};

export const getWeekShitters: (guildId: string) => Promise<Entry[]> = async (
  guildId
) => {
  try {
    const dateNow: Date = new Date();

    dateNow.setDate(dateNow.getDate() - dateNow.getDay());
    dateNow.setHours(0);

    const db = firestore();
    const entriesRef = db
      .collection(guildId)
      .where("type", "==", "create")
      .where("created", ">", firestore.Timestamp.fromDate(dateNow));
    const snapshot = await entriesRef.get();

    return iterateAndSortSnapshot(snapshot);
  } catch (error) {
    console.log(error);
  }
};

export const getDailyShitters: (guildId: string) => Promise<Entry[]> = async (
  guildId
) => {
  try {
    const dateNow: Date = new Date();
    dateNow.setHours(0);

    const db = firestore();
    const entriesRef = db
      .collection(guildId)
      .where("type", "==", "create")
      .where("created", ">", firestore.Timestamp.fromDate(dateNow));
    const snapshot = await entriesRef.get();

    return iterateAndSortSnapshot(snapshot);
  } catch (error) {
    console.log(error);
  }
};

export const addEntry: (
  guildId: string,
  entry: Entry
) => Promise<void> = async (guildId, entry) => {
  const db = firestore();

  try {
    await db.collection(guildId).add({
      ...entry,
      created: firestore.FieldValue.serverTimestamp(),
    });
  } catch (err) {
    console.log("err");
  }
};

const iterateAndSortSnapshot: (snapshot: firestore.QuerySnapshot) => Entry[] = (
  snapshot
) => {
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
};
