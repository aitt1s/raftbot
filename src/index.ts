import * as dotenv from "dotenv";
import { MessageReaction, Client, Message } from "discord.js";
import * as firebase from "firebase-admin";

dotenv.config();

enum EntryType {
  CREATE = "create",
  LIKE = "like",
  UNLIKE = "unlike",
}

interface Author {
  id: string;
  username: string;
}

interface Entry {
  type: EntryType;
  messageId: string;
  author: Author;
}

// Initialize Firebase
firebase.initializeApp({
  credential: firebase.credential.applicationDefault(),
});

const db = firebase.firestore();

if (!process.env.DISCORD_BOT_TOKEN) {
  throw new Error("Discord bot token not configured!");
}

const client: Client = new Client();

client.on("message", async function (message: Message) {
  if (message.author.bot) return;

  if (isBotCommand(message)) {
    await runBotCommand(message);
    return;
  }

  if (doesMatch(message)) {
    await addEntry({
      type: EntryType.CREATE,
      messageId: message.id,
      author: {
        id: message.author.id,
        username: message.author.username,
      },
    });

    message.react("✅");
  }
});

client.on("messageReactionAdd", function (reaction: MessageReaction) {
  if (reaction.me) return;

  const { message } = reaction;

  if (doesMatch(message)) {
    addEntry({
      type: EntryType.LIKE,
      messageId: message.id,
      author: {
        id: message.author.id,
        username: message.author.username,
      },
    });
  }
});

client.on("ready", () => {
  console.log("Bot connected");
});

client.login(process.env.DISCORD_BOT_TOKEN);

// funcs

const doesMatch: (message: Message) => boolean = (message) =>
  !!message?.content?.toLowerCase()?.match(/\bhep\b|\uD83D\uDCA9/);

const isBotCommand: ({ content }: { content: string }) => boolean = ({
  content,
}) => content?.startsWith("!raftbot");

const runBotCommand: (message: Message) => Promise<void> = async (message) => {
  const { content, channel } = message;
  try {
    const entriesRef = db.collection("entries");

    if (content.toLowerCase().includes("ath-shitters")) {
      let shitters = [];

      const snapshot = await entriesRef.get();
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

      const formatShitters = shitters
        .map(
          (shitter, index) =>
            `${index + 1}. ${shitter.author.username}, ${
              shitter.count
            } times 💩`
        )
        .join("\n");

      channel.send(`\`\`\`Top ATH shitters:\n${formatShitters}\`\`\``);
    }
  } catch (error) {
    console.log(error);
  }
};

async function addEntry(entry: Entry) {
  try {
    await db.collection("entries").add({
      ...entry,
      created: firebase.firestore.FieldValue.serverTimestamp(),
    });
  } catch (err) {
    console.log("err");
  }
}
