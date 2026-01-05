import { ButtonBuilder, ButtonStyle, ComponentType, ContainerBuilder, MessageFlags, SectionBuilder, SlashCommandBuilder } from 'discord.js';
import { dbGetUser, dbAddCurrency } from './database.js';

export const commandName = 'i';
export const commandDesc = 'Idle';
export const commandData = new SlashCommandBuilder().setName(commandName).setDescription(commandDesc).toJSON();

const timeout = 1_800_000; // 30 Minutes
const plusButtonId = 'plusButton';

/** Function that executes when interaction is received */
export async function execute(interaction) {
    const user = await dbGetUser(interaction.user.id);

    /** Send initial message */
    const response = await interaction.reply({
        components: [homeContainerBuilder(user)],
        flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
        withResponse: true
    });

    /** Timeout the message at the same time as the collectors */
    setTimeout(() => { interaction.editReply({ components: [timedOutContainerBuilder()] }); }, timeout);

    /** Button collector */
    const buttonCollector = response.resource.message.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: timeout,
    });
    buttonCollector.on('collect', async (i) => {
        if (i.customId === plusButtonId) {
            await dbAddCurrency(user, 5);
            i.update({ components: [homeContainerBuilder(user)] })
        }
    });
}

/** ContainerBuilder to start every response */
const containerBuilderBase = () => {
    return new ContainerBuilder()
        .addTextDisplayComponents(textDisplay => textDisplay.setContent('# Simple Idle'))
        .addSeparatorComponents(separator => separator);
}

/** Home page ContainerBuilder */
function homeContainerBuilder(user) {
    return containerBuilderBase()
        .addTextDisplayComponents(textDisplay => textDisplay.setContent(`Currency: ${user.currency}`))
        .addActionRowComponents(actionRow => actionRow.addComponents(
            new ButtonBuilder().setCustomId(plusButtonId).setLabel('+5').setStyle(ButtonStyle.Success)
        ));
}

/** Timed out page ContainerBuilder */
function timedOutContainerBuilder() {
    return containerBuilderBase().addTextDisplayComponents(textDisplay => textDisplay.setContent(`*This instance of /${commandName} has timed out*`));
}