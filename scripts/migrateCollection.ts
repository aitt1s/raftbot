import * as dotenv from "dotenv";
import { firestore } from "firebase-admin";
import { initFirebase } from "../src/config/firebase";

dotenv.config();

async function migrate() {
  try {
    await initFirebase();
    const db = await firestore();

    let onesToMigrate = [];

    // add the existing collection where we want to copy
    const fromRef = db.collection("entries");

    // add the target collection where we want to transfer stuff
    const toRef = db.collection("807239396998774805");

    const snapshot = await fromRef.get();

    snapshot.forEach(async (doc) => {
      onesToMigrate.push(doc.data());
    });

    for await (const entry of onesToMigrate) {
      await toRef.add(entry);
    }
  } catch (error) {
    console.error("migration failed", error);
  }
}

migrate().catch(() => {
  console.log("done");
});
