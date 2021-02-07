import { firestore } from "firebase-admin";
import { Entry, FirebaseStructure } from "../types/Raftbot";

const getCollectinRef: (
  guildId: string,
  collection: FirebaseStructure
) => firestore.CollectionReference<firestore.DocumentData> = (
  guildId,
  collection
) =>
  firestore()
    .collection(FirebaseStructure.GUILDS)
    .doc(guildId)
    .collection(collection);

export const getAllShitters: (guildId: string) => Promise<Entry[]> = async (
  guildId
) => {
  try {
    const snapshot = await getCollectinRef(
      guildId,
      FirebaseStructure.ENTRIES
    ).get();

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

    const snapshot = await getCollectinRef(guildId, FirebaseStructure.ENTRIES)
      .where("created", ">", firestore.Timestamp.fromDate(dateNow))
      .get();

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

    const snapshot = await getCollectinRef(guildId, FirebaseStructure.ENTRIES)
      .where("created", ">", firestore.Timestamp.fromDate(dateNow))
      .get();

    return iterateAndSortSnapshot(snapshot);
  } catch (error) {
    console.log(error);
  }
};

export const addEntry: (
  guildId: string,
  entry: Entry
) => Promise<void> = async (guildId, entry) => {
  try {
    await getCollectinRef(guildId, FirebaseStructure.ENTRIES).add({
      ...entry,
      created: firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.log(error);
  }
};

export const addReaction: (
  guildId: string,
  entry: Entry
) => Promise<void> = async (guildId, entry) => {
  try {
    await getCollectinRef(guildId, FirebaseStructure.LIKES).add({
      ...entry,
      created: firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.log(error);
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
