import { Client, Events, GatewayIntentBits, REST, Routes } from 'discord.js'
import { commandName, commandData, execute } from './command.js';
import { dbInit } from './database.js';

const DEV_MODE    = process.argv[2] === 'dev';
const devGuildId  = process.env.DEV_GUILD_ID;

const clientId    = process.env.CLIENT_ID;
const token       = process.env.DISCORD_TOKEN;
const rest        = new REST().setToken(token);

// Delete existing command from Discord, then push new command to Discord
(async () => {
	try {
		// Delete command from dev server
		await rest.put(Routes.applicationGuildCommands(clientId, devGuildId), { body: [] });
		console.log('Deleted dev guild command');

		// Delete command globally
		await rest.put(Routes.applicationCommands(clientId), { body: [] });
		console.log('Deleted global command');

		// In dev mode, push command to test quickly
		if (DEV_MODE) {
			await rest.put(Routes.applicationGuildCommands(clientId, devGuildId), { body: [commandData] });
			console.log('Pushed dev guild command');
		}
		// Otherwise, push the commands globally which can take a few minutes to appear
		else {
			await rest.put(Routes.applicationCommands(clientId), { body: [commandData] });
			console.log('Pushed global command');
		}
	} catch (error) {
		console.error(error);
	}
})();

// Initialize the database
dbInit().then(() => console.log('Database initialized'));

// Create the Discord client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.login(token);
client.once(Events.ClientReady, () => console.log('Bot running'));

// Handle the interaction
client.on(Events.InteractionCreate, (interaction) => {
	if (!interaction.isChatInputCommand()) return;
	if (interaction.commandName === commandName) execute(interaction);
});