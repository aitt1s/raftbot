import { firestore } from "firebase-admin";
import { Entry } from "../types/Raftbot";

export const getAllShitters: () => Promise<Entry[]> = async () => {
  try {
    const db = firestore();
    const entriesRef = db.collection("entries").where("type", "==", "create");
    const snapshot = await entriesRef.get();

    return iterateAndSortSnapshot(snapshot);
  } catch (error) {
    console.log(error);
  }
};

export const getWeekShitters: () => Promise<Entry[]> = async () => {
  try {
    const dateNow: Date = new Date();

    dateNow.setDate(dateNow.getDate() - dateNow.getDay());
    dateNow.setHours(0);

    const db = firestore();
    const entriesRef = db
      .collection("entries")
      .where("type", "==", "create")
      .where("created", ">", dateNow);
    const snapshot = await entriesRef.get();

    return iterateAndSortSnapshot(snapshot);
  } catch (error) {
    console.log(error);
  }
};

export const getDailyShitters: () => Promise<Entry[]> = async () => {
  try {
    const dateNow: Date = new Date();
    dateNow.setHours(0);

    console.log(firestore.Timestamp.fromDate(dateNow).toDate());
    const db = firestore();
    const entriesRef = db
      .collection("entries")
      .where("type", "==", "create")
      .where("created", ">", firestore.Timestamp.fromDate(dateNow));
    const snapshot = await entriesRef.get();

    return iterateAndSortSnapshot(snapshot);
  } catch (error) {
    console.log(error);
  }
};

export const addEntry: (entry: Entry) => Promise<void> = async (entry) => {
  const db = firestore();

  try {
    await db.collection("entries").add({
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
