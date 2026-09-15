const createModel = require('../handlers/sqliteModel.js');

module.exports = createModel({
	table: 'registers',
	fields: {
		row: 0,
		completed: false,
		gender: '',
		guildID: '',
		userID: '',
		staffID: '',
		date: Date.now,
		nameArray: [],
		options: {},
	},
});