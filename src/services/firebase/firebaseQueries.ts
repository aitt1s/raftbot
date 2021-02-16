import { firestore } from "firebase-admin";
import { FirebaseStructure } from "../../types/Raftbot";
import { getCollectinRef } from "./firebaseHelpers";
import { Message } from "discord.js";
import { DateTime } from "luxon";

export async function getEntries(
  message: Message,
  start: DateTime,
  metric: string
) {
  try {
    let query: any = getCollectinRef(
      message.guild.id,
      FirebaseStructure.ENTRIES
    );

    query = query.where(
      "created",
      ">",
      firestore.Timestamp.fromDate(start.toJSDate())
    );

    if (metric === "me") {
      query = query.where("author.id", "==", message.author.id);
    }

    const snapshot = await query;

    return snapshot.get();
  } catch (error) {
    console.log("Couldnt get entries", error);
  }
}
