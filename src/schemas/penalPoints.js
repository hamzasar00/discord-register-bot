const createModel = require('../handlers/sqliteModel.js');

module.exports = createModel({
	table: 'penal_points',
	fields: {
		guildID: '',
		userID: '',
		penalPoint: 0,
	},
});