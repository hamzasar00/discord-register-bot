const createModel = require('../handlers/sqliteModel.js');

module.exports = createModel({
	table: 'penals',
	fields: {
		id: 0,
		userID: '',
		guildID: '',
		type: '',
		active: true,
		staffID: '',
		reason: '',
		temp: false,
		date: Date.now,
		finishDate: undefined,
		removed: false,
	},
});