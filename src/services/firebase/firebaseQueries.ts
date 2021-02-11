import { firestore } from "firebase-admin";
import { FirebaseStructure, CommandConfig } from "../../types/Raftbot";
import { getCollectinRef } from "./firebaseHelpers";
import { startOf } from "../../helpers/dateHelpers";
import { Message } from "discord.js";

export async function getEntries(message: Message, configs: CommandConfig) {
  try {
    let query: any = getCollectinRef(
      message.guild.id,
      FirebaseStructure.ENTRIES
    );

    if (configs?.unit) {
      const start = startOf(configs.unit || "month");

      query = query.where(
        "created",
        ">",
        firestore.Timestamp.fromDate(start.toJSDate())
      );
    }

    if (configs?.command === "me") {
      query = query.where("author.id", "==", message.author.id);
    }

    const snapshot = await query;

    return snapshot.get();
  } catch (error) {
    console.log("Couldnt get entries", error);
  }
}
