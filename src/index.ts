import * as dotenv from "dotenv";

import { Client } from "discord.js";
import { initFirebase } from "./config/firebase";
import {
  handleMessage,
  handleReaction,
  handleReady,
} from "./handlers/messageHandler";

dotenv.config();
initFirebase();

if (!process.env.DISCORD_BOT_TOKEN) {
  throw new Error("Discord bot token not configured!");
}

const client: Client = new Client();

client.on("message", handleMessage);
client.on("messageReactionAdd", handleReaction);
client.on("ready", () => handleReady(client));

client.login(process.env.DISCORD_BOT_TOKEN);
