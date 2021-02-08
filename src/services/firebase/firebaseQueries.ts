import { firestore } from "firebase-admin";
import { Entry, FirebaseStructure, Dateset } from "../../types/Raftbot";
import { DateTime } from "luxon";
import {
  getCollectinRef,
  sortByUserEntries,
  sortByDailyOccurencesInWeek,
  sortByDailyOccurencesPerUser,
} from "./firebaseHelpers";

DateTime.local().setZone(process.env.TZ || "Europe/Helsinki");

export async function getATHShitters(guildId: string): Promise<Entry[]> {
  try {
    const collectionRef = getCollectinRef(guildId, FirebaseStructure.ENTRIES);
    const snapshot = await collectionRef.get();

    return sortByUserEntries(snapshot);
  } catch (error) {
    console.log(error);
  }
}

export async function getWeeklyShitters(guildId: string): Promise<Entry[]> {
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

    return sortByUserEntries(snapshot);
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

    return sortByUserEntries(snapshot);
  } catch (error) {
    console.log(error);
  }
}

export async function getWeeklyEntries(guildId: string): Promise<Dateset[]> {
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

    return sortByDailyOccurencesInWeek(snapshot);
  } catch (error) {
    console.log(error);
  }
}

export async function getMyEntries(
  guildId: string,
  userId: string
): Promise<Dateset[]> {
  try {
    const collectionRef = getCollectinRef(guildId, FirebaseStructure.ENTRIES);
    const snapshot = await collectionRef.where("author.id", "==", userId).get();

    return sortByDailyOccurencesPerUser(snapshot);
  } catch (error) {
    console.log(error);
  }
}
