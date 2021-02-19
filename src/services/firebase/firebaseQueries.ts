import { firestore } from "firebase-admin";
import { FirebaseStructure } from "../../types/Raftbot";
import { getCollectinRef } from "./firebaseHelpers";
import { Message } from "discord.js";
import { DateTime } from "luxon";
import { InputConfig } from "../../handlers/inputConfig";

export async function getEntries(message, configs: InputConfig) {
  try {
    const query: any = getCollectinRef(
      message.guild.id,
      FirebaseStructure.ENTRIES
    );

    let current;
    let comparison;

    current = query.where(
      "created",
      ">",
      firestore.Timestamp.fromDate(configs.start.toJSDate())
    );

    if (configs.comparison) {
      comparison = query
        .where(
          "created",
          ">",
          firestore.Timestamp.fromDate(configs.comparisonStart.toJSDate())
        )
        .where(
          "created",
          "<",
          firestore.Timestamp.fromDate(configs.comparisonEnd.toJSDate())
        );
    }

    if (configs.metric === "me") {
      current = query.where("author.id", "==", message?.author?.id);
      comparison = query.where("author.id", "==", message?.author?.id);
    }

    return {
      current: await (await current).get(),
      comparison: configs.comparison ? await (await comparison).get() : null,
    };
  } catch (error) {
    console.log("Couldnt get entries", error);
  }
}
