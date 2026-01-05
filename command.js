import {
    ContainerBuilder,
    MessageFlags,
    SlashCommandBuilder
} from 'discord.js';

export const commandName = 'i';
export const commandDesc = 'Idle';
export const commandData = new SlashCommandBuilder().setName(commandName).setDescription(commandDesc).toJSON();

export async function execute(interaction) {
    const containerBuilder = new ContainerBuilder()
        .addTextDisplayComponents(textDisplay => textDisplay.setContent('lol'))
    const response = await interaction.reply({
        components: [containerBuilder],
        flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
        withResponse: true
    });
}