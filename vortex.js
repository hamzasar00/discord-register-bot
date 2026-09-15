require('dotenv').config();

const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const client = (global.client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Channel, Partials.Message, Partials.User],
}));
const { readdirSync } = require('fs');
require('./src/configs/settings.js')(client);
require('./src/handlers/compatibility.js');
require('./src/handlers/functions.js')(client);
const { Token } = client.settings;

if (!Token) {
    console.error('[BOT] DISCORD_TOKEN is missing. Set it in .env or the process environment.');
}

if (!Token) process.exit(1);

// Collections
client.commands = new Collection();
client.cooldowns = new Collection();

// Handlers
require('./src/handlers/sqliteHandler.js');
require('./src/handlers/eventHandler.js');
client.slashCommands = require('./src/handlers/slashCommandHandler.js');

// Checking Commands
readdirSync('./src/commands').filter(dir => {
    const commandFiles = readdirSync(`./src/commands/${dir}/`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./src/commands/${dir}/${file}`);
	client.commands.set(command.name, command);
	// console.log(`[COMMAND] ${command.name} Loaded!`);
    }
});

// Connecting To Client
client.login(Token).then(() => console.log('[BOT] Connection Started')).catch((error) => {
    console.error('[BOT] Failed To Start Connection:', error.message);
    process.exit(1);
});
