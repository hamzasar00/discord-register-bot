const { client } = global;
const { ActivityType } = require('discord.js');
const { statusMessages } = client;
const { Prefix, VoiceChannel, Activity, Status } = client.settings;
const { guildID } = client.guildSettings;
const { success } = require('../configs/emojis.json');
const commands = require('../schemas/commands.js');
const reload = require('../schemas/reload.js');
const slashCommands = require('../handlers/slashCommands.js');
const moment = require('moment');
require('moment-duration-format');
moment.locale('tr');

module.exports = async () => {

	console.log(`[BOT] Connected To ${client.user.tag}`);

	// Slash Commands
	if (client.settings.SlashCommandsEnabled && guildID) {
		try {
			const guild = await client.guilds.fetch(guildID);
			await guild.commands.set(slashCommands.map(command => ({
				name: command.name,
				description: command.description,
				options: command.options || [],
			})));

			console.log(`[SLASH] ${slashCommands.length} guild command registered`);
		}
		catch (error) {
			console.error('[SLASH] Commands could not be registered:', error.message);
		}
	}
	else if (client.settings.SlashCommandsEnabled) {
		try {
			await client.application.commands.set(slashCommands.map(command => ({
				name: command.name,
				description: command.description,
				options: command.options || [],
			})));

			console.log(`[SLASH] ${slashCommands.length} global commands registered`);
		}
		catch (error) {
			console.error('[SLASH] Global commands could not be registered:', error.message);
		}
	}

	// Status
	const activityType = ActivityType[Activity.charAt(0).toUpperCase() + Activity.slice(1).toLowerCase()] || ActivityType.Watching;
	client.user.setPresence({ activities: [{ type: activityType, name: statusMessages.random() }], status: Status });

	setInterval(() => {

		client.user.setPresence({ activities: [{ type: activityType, name: statusMessages.random() }], status: Status });
		console.log('[STATUS] Status Has Been Updated');

	}, 600000);

	// Voice
	if (VoiceChannel) {
		console.log('[VOICE] VoiceChannel is configured, but automatic voice connection is disabled in this version.');
	}

	// Reload
	const data = await reload.findOne({ type: 'register' });

	if(data) {

		client.channels.cache.get(data.channelID).messages.fetch(data.messageID).then(async msg => {

			console.log('[BOT] Connection Reloaded');
			await msg.edit(`**Yeniden Başlatıldı** ${success ? success : ''}`);
			await reload.findOneAndDelete({ type: 'register' });

		});

	}

	// Saving Commands
	if(!guildID) return;

	const commandArray = new Array();
	client.commands.forEach(async command => {

		commandArray.push(Prefix + command.name);
		if(command.aliases) command.aliases.forEach(alias => commandArray.push(Prefix + alias));

	});

	await commands.findOneAndUpdate({ guildID: guildID }, { $set: { registerCommands: commandArray } }, { upsert: true });
	console.log('[BOT] Commands Saved!');

};

module.exports.conf = {
	name: 'Ready',
	event: 'ready',
};