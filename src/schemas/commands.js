const createModel = require('../handlers/sqliteModel.js');

module.exports = createModel({
	table: 'commands',
	fields: {
		guildID: '',
		registerCommands: [],
	},
});