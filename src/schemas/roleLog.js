const createModel = require('../handlers/sqliteModel.js');

module.exports = createModel({
	table: 'role_logs',
	fields: {
		type: '',
		guildID: '',
		staffID: '',
		userID: '',
		roleID: '',
		date: Date.now,
	},
});