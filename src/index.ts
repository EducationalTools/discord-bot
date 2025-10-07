import { Client, PresenceUpdateStatus } from "discord.js";
import { deployCommands } from "./deploy-commands";
import { commands } from "./commands";
import { config } from "./config";

const client = new Client({
  intents: ["Guilds", "GuildMessages", "DirectMessages"],
});

client.once("clientReady", (readyClient) => {
  console.log("Discord bot is ready!");
  deployCommands({ guildId: config.DISCORD_GUILD_ID });

  readyClient.user.setPresence({
    activities: [{ name: "EduTools", type: 0 }],
    status: PresenceUpdateStatus.Online,
  });
});

client.on("guildCreate", async (guild) => {
  await deployCommands({ guildId: guild.id });
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }
  const { commandName } = interaction;
  if (commands[commandName as keyof typeof commands]) {
    commands[commandName as keyof typeof commands].execute(interaction);
  }
});

client.login(config.DISCORD_TOKEN);
