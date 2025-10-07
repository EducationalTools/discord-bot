import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Check if bot is online");

export async function execute(interaction: CommandInteraction) {
  return interaction.reply("Pong!");
}
