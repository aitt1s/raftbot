import { firestore } from "firebase-admin";
import { Entry, FirebaseStructure } from "../../types/Raftbot";
import { DateTime } from "luxon";
import { getCollectinRef, iterateAndSortSnapshot } from "./firebaseHelpers";

DateTime.local().setZone(process.env.TZ || "Europe/Helsinki");

export async function getATHShitters(guildId: string): Promise<Entry[]> {
  try {
    const collectionRef = getCollectinRef(guildId, FirebaseStructure.ENTRIES);
    const snapshot = await collectionRef.get();

    return iterateAndSortSnapshot(snapshot);
  } catch (error) {
    console.log(error);
  }
}

export async function getWeeklyShitters(guildId: string): Promise<Entry[]> {
  try {
    const snapshot = await getWeeklyEntries(guildId);

    return iterateAndSortSnapshot(snapshot);
  } catch (error) {
    console.log(error);
  }
}

export async function getDailyShitters(guildId: string): Promise<Entry[]> {
  try {
    const startOfDay = DateTime.local().startOf("day");
    const collectionRef = getCollectinRef(guildId, FirebaseStructure.ENTRIES);
    const snapshot = await collectionRef
      .where(
        "created",
        ">",
        firestore.Timestamp.fromDate(startOfDay.toJSDate())
      )
      .get();

    return iterateAndSortSnapshot(snapshot);
  } catch (error) {
    console.log(error);
  }
}

export async function getWeeklyEntries(
  guildId: string
): Promise<firestore.QuerySnapshot> {
  try {
    const startOfWeek = DateTime.local().startOf("week");
    const collectionRef = getCollectinRef(guildId, FirebaseStructure.ENTRIES);
    const snapshot = await collectionRef
      .where(
        "created",
        ">",
        firestore.Timestamp.fromDate(startOfWeek.toJSDate())
      )
      .get();

    return snapshot;
  } catch (error) {
    console.log(error);
  }
}
