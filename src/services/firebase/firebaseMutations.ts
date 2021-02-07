import { firestore } from "firebase-admin";
import { Entry, FirebaseStructure } from "../../types/Raftbot";
import { getCollectinRef } from "./firebaseHelpers";

export async function addEntry(guildId: string, entry: Entry): Promise<void> {
  try {
    const collectionRef = getCollectinRef(guildId, FirebaseStructure.ENTRIES);

    await collectionRef.add({
      ...entry,
      created: firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.log(error);
  }
}

export async function addReaction(
  guildId: string,
  entry: Entry
): Promise<void> {
  try {
    const collectionRef = getCollectinRef(guildId, FirebaseStructure.LIKES);

    await collectionRef.add({
      ...entry,
      created: firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.log(error);
  }
}
