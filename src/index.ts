import { Client, GatewayIntentBits, PresenceUpdateStatus } from "discord.js";
import { deployCommands } from "./deploy-commands";
import { commands } from "./commands";
import { config } from "./config";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.once("clientReady", (readyClient) => {
  console.log("Discord bot is ready!");
  deployCommands({ guildId: config.DISCORD_GUILD_ID });

  readyClient.user.setPresence({
    activities: [{ name: "EduTools", type: 0 }],
    status: PresenceUpdateStatus.Online,
  });

  (async () => {
    const channel = client.channels.cache.get(config.DISCORD_INFO_CHANNEL_ID);
    if (
      channel &&
      channel.isTextBased() &&
      "bulkDelete" in channel &&
      typeof channel.bulkDelete === "function"
    ) {
      const messages = await channel.messages.fetch({ limit: 1 });
      const messageData = {
        embeds: [
          //           {
          //             title: "Privacy",
          //             description: `## Logging
          // We store audit logs using Sapphire, and use them for moderation. Only users with the <@&1419511929101221962> role can access them. We log almost everything apart from message deletes and edits, because I think that is a privacy violation.
          // ## Bots
          // This server has a few bots on it, including <@437808476106784770>, <@356268235697553409> and <@678344927997853742> which all have their own privacy policies. If you care about privacy, you probably ~~shouldn't be using discord~~ should read their privacy policies.`,
          //             color: 3447003,
          //           },
          {
            title: "Privacy",
            description: `## Logging
      We store audit logs using Sapphire, and use them for moderation. Only users with the <@&1419511929101221962> role can access them. We log almost everything apart from message deletes and edits, because I think that is a privacy violation.
      ## Bots
      This server has a few bots on it, including <@437808476106784770>, <@356268235697553409> and <@678344927997853742> which all have their own privacy policies. If you care about privacy, you probably ~~shouldn't be using discord~~ should read their privacy policies.`,
            color: 3066993,
          },
          {
            title: "Rules",
            description: `1. Treat everyone with respect. Absolutely no harassment, witch hunting, sexism, racism, or hate speech will be tolerated.2. Swearing is allowed, as long as it follows the above rule.
      3. No spam or self-promotion (server invites, advertisements, etc) without permission from a staff member. This includes DMing fellow members.
      4. No age-restricted or obscene content. This includes text, images, or links featuring nudity, sex, hard violence, or other graphically disturbing content.
      5. If you see something against the rules or something that makes you feel unsafe, let us know by right clicking, pressing apps, then report to mods. We want this server to be a welcoming space!
      6. Do not attempt to circumvent auto moderation. ~~I know this is a server for a website that is built to circumvent internet filters, but~~ the auto moderation is there for a reason.
      7. Don't ping people randomly with no reason.
      8. You can ping me (<@907855965934714930>), I don't mind.
      9. English only. This makes it easier to moderate.

      Any violation of these rules will result in you being warned, and maybe even kicked or banned.`,
            color: 16711680,
          },
          {
            title: "Invite Link",
            description: "```\nhttps://discord.gg/AFec9wNar8\n```",
            color: 16777215,
          },
          {
            timestamp: "2025-09-24T09:57:00.000Z",
            footer: {
              text: "Last updated",
            },
          },
        ],
      };
      let message = messages.first();
      if (message.embeds == messageData.embeds) {
        await message.delete();
        await channel.send();
      }
    }
  })();
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
