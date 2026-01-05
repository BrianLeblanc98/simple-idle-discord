import {
    Client,
    Events,
    GatewayIntentBits,
    REST,
    Routes
} from 'discord.js'
import {
	commandName,
	commandData,
	execute
} from './command.js';
import {
	dbInit
} from './database.js';

const DEV_MODE    = process.argv[2] === 'dev';
const devGuildId  = process.env.DEV_GUILD_ID;

const clientId    = process.env.CLIENT_ID;
const token       = process.env.DISCORD_TOKEN;
const rest        = new REST().setToken(token);

// Clear the command from all servers
rest.put(Routes.applicationGuildCommands(clientId, devGuildId), { body: [] })
    .then(() => console.log('Deleted dev guild command'))
    .catch(console.error);
rest.put(Routes.applicationCommands(clientId), { body: [] })
	.then(() => console.log('Deleted all application command'))
	.catch(console.error);

// Push the command to all servers
(async () => {
	try {
		// In dev mode, push command to test immediately
		if (DEV_MODE) await rest.put(Routes.applicationGuildCommands(clientId, devGuildId), { body: [commandData] });
		// Otherwise, push the commands globally which can take a few minutes to appear
		else await rest.put(Routes.applicationCommands(clientId), { body: [commandData] });
	} catch (error) {
		console.error(error);
	}
})();

// Create the Discord client, then initialize the database
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.login(token);
client.once(Events.ClientReady, async () => {
	console.log('Simple Idle bot running');
	await dbInit();
	console.log('Database initialized');
});

// Handle the interaction from /idle TODO: may not need async
client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;
	
	if (interaction.commandName === commandName) execute(interaction);
});