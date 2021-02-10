import { firestore } from "firebase-admin";
import { Entry, FirebaseStructure, Dateset } from "../../types/Raftbot";
import {
  getCollectinRef,
  sortTopShitters,
  sortTotalShits,
  sortMyShits,
} from "./firebaseHelpers";

import { startOf } from "../../helpers/dateHelpers";

import { DurationUnit } from "luxon";
import { Frequency } from "rrule";

export async function getATHShitters(guildId: string): Promise<Entry[]> {
  try {
    const collectionRef = getCollectinRef(guildId, FirebaseStructure.ENTRIES);
    const snapshot = await collectionRef.get();

    return sortTopShitters(snapshot);
  } catch (error) {
    console.log(error);
  }
}

export async function getTopShitters(
  guildId: string,
  {
    unit = "week",
  }: {
    unit: DurationUnit;
  }
): Promise<Entry[]> {
  try {
    const start = startOf(unit);
    const collectionRef = getCollectinRef(guildId, FirebaseStructure.ENTRIES);
    const snapshot = await collectionRef
      .where("created", ">", firestore.Timestamp.fromDate(start.toJSDate()))
      .get();

    return sortTopShitters(snapshot);
  } catch (error) {
    console.log(error);
  }
}

export async function getDailyShitters(guildId: string): Promise<Entry[]> {
  try {
    const startOfDay = startOf("day");
    const collectionRef = getCollectinRef(guildId, FirebaseStructure.ENTRIES);
    const snapshot = await collectionRef
      .where(
        "created",
        ">",
        firestore.Timestamp.fromDate(startOfDay.toJSDate())
      )
      .get();

    return sortTopShitters(snapshot);
  } catch (error) {
    console.log(error);
  }
}

export async function getTotalShits(
  guildId: string,
  {
    unit = "week",
    freq = Frequency.DAILY,
  }: {
    unit: DurationUnit;
    freq: Frequency;
  }
): Promise<Dateset[]> {
  try {
    const start = startOf(unit);
    const collectionRef = getCollectinRef(guildId, FirebaseStructure.ENTRIES);
    const snapshot = await collectionRef
      .where("created", ">", firestore.Timestamp.fromDate(start.toJSDate()))
      .get();

    return sortTotalShits(snapshot, { unit, freq });
  } catch (error) {
    console.log(error);
  }
}

export async function getMyShits(
  guildId: string,
  userId: string,
  {
    unit = "week",
    freq = Frequency.DAILY,
  }: {
    unit: DurationUnit;
    freq: Frequency;
  }
): Promise<Dateset[]> {
  try {
    const start = startOf(unit);
    const collectionRef = getCollectinRef(guildId, FirebaseStructure.ENTRIES);
    const snapshot = await collectionRef
      .where("author.id", "==", userId)
      .where("created", ">", firestore.Timestamp.fromDate(start.toJSDate()))
      .get();

    return sortMyShits(snapshot, { unit, freq });
  } catch (error) {
    console.log(error);
  }
}
