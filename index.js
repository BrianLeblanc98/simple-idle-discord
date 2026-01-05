import {
    Client,
    Events,
    GatewayIntentBits,
    REST,
    Routes,
    SlashCommandBuilder
} from 'discord.js'

const token      = process.env.DISCORD_TOKEN;
const clientId   = process.env.CLIENT_ID;
const devGuildId = process.env.DEV_GUILD_ID;
const DEV_MODE   = process.argv[2] === 'dev';
const rest       = new REST().setToken(token);

// Clear the command from all servers
rest.put(Routes.applicationGuildCommands(clientId, devGuildId), { body: [] })
    .then(() => console.log('Deleted dev guild command'))
    .catch(console.error);

rest.put(Routes.applicationCommands(clientId), { body: [] })
	.then(() => console.log('Deleted all application command'))
	.catch(console.error);

// Push the command to all servers
const slashCommandBuilderJSON = new SlashCommandBuilder().setName('i').setDescription('idle').toJSON();
(async () => {
	try {
		if (DEV_MODE) await rest.put(Routes.applicationGuildCommands(clientId, devGuildId), { body: [slashCommandBuilderJSON] });
		else await rest.put(Routes.applicationCommands(clientId), { body: [slashCommandBuilderJSON] });
	} catch (error) {
		console.error(error);
	}
})();

// Create the Discord client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.login(token);
client.once(Events.ClientReady, () => console.log('Simple Idle started'));

// Handle the interaction from /idle
client.on(Events.InteractionCreate, (interaction) => {
	if (!interaction.isChatInputCommand()) return; 
	interaction.reply('A command!');
});