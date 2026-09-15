const createModel = require('../handlers/sqliteModel.js');

module.exports = createModel({
	table: 'reload',
	fields: {
		type: 'register',
		authorID: '',
		channelID: '',
		messageID: '',
	},
});