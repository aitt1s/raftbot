import { firestore } from "firebase-admin";
import {
  FirebaseStructure,
  InputCommand,
  InputUnit,
  InputType,
} from "../../types/Raftbot";
import { getCollectinRef } from "./firebaseHelpers";
import { Message } from "discord.js";
import { InputConfig } from "../../handlers/inputConfig";

export async function getEntries(message: Message, configs: InputConfig) {
  try {
    let query: any = getCollectinRef(
      message.guild.id,
      FirebaseStructure.ENTRIES
    );

    if (configs?.unit) {
      const start = configs.start;

      query = query.where(
        "created",
        ">",
        firestore.Timestamp.fromDate(start.toJSDate())
      );
    }

    if (configs?.command === InputCommand.MY) {
      query = query.where("author.id", "==", message.author.id);
    }

    const snapshot = await query;

    return snapshot.get();
  } catch (error) {
    console.log("Couldnt get entries", error);
  }
}
