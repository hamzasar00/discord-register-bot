const database = require('./sqliteHandler.js');

const clone = (value) => {
	if (value === undefined) return undefined;
	return JSON.parse(JSON.stringify(value));
};

class SqliteQuery {

	constructor(model, filter) {
		this.model = model;
		this.filter = filter;
		this.sortDefinition = null;
	}

	sort(definition) {
		this.sortDefinition = definition;
		return this;
	}

	then(resolve, reject) {
		return Promise.resolve(this.model._find(this.filter, this.sortDefinition)).then(resolve, reject);
	}

	catch(reject) {
		return this.then(undefined, reject);
	}

}

module.exports = ({ table, fields }) => {

	database.exec(`
		CREATE TABLE IF NOT EXISTS "${table}" (
			"_id" INTEGER PRIMARY KEY AUTOINCREMENT,
			"payload" TEXT NOT NULL
		)
	`);

	const applyDefaults = (input = {}) => {
		const document = {};
		for (const [field, defaultValue] of Object.entries(fields)) {
			if (input[field] !== undefined) document[field] = clone(input[field]);
			else if (typeof defaultValue === 'function') document[field] = defaultValue();
			else if (defaultValue !== undefined) document[field] = clone(defaultValue);
		}

		for (const [field, value] of Object.entries(input)) {
			if (value !== undefined && document[field] === undefined) document[field] = clone(value);
		}

		return document;
	};

	const matches = (document, filter = {}) => Object.entries(filter).every(([field, expected]) => document[field] === expected);

	const makeDocument = (id, payload) => {
		const document = applyDefaults(payload);
		document._id = id;
		return document;
	};

	class Model {

		constructor(input = {}) {
			Object.assign(this, applyDefaults(input));
			if (input._id !== undefined) this._id = input._id;
		}

		async save() {
			Model._persist(this);
			return this;
		}

		static _persist(document) {
			const payload = {};
			for (const [field, value] of Object.entries(document)) {
				if (field !== '_id' && value !== undefined) payload[field] = value;
			}

			if (document._id === undefined) {
				const result = database.prepare(`INSERT INTO "${table}" (payload) VALUES (?)`).run(JSON.stringify(payload));
				document._id = Number(result.lastInsertRowid);
			}
			else {
				database.prepare(`UPDATE "${table}" SET payload = ? WHERE _id = ?`).run(JSON.stringify(payload), document._id);
			}
		}

		static _rows() {
			return database.prepare(`SELECT _id, payload FROM "${table}"`).all().map(row => makeDocument(row._id, JSON.parse(row.payload)));
		}

		static _find(filter = {}, sortDefinition = null) {
			const documents = this._rows().filter(document => matches(document, filter));
			if (sortDefinition) {
				const [[field, direction]] = Object.entries(sortDefinition);
				documents.sort((left, right) => {
					if (left[field] === right[field]) return 0;
					return (left[field] > right[field] ? 1 : -1) * (direction < 0 ? -1 : 1);
				});
			}
			return documents;
		}

		static find(filter = {}) {
			return new SqliteQuery(this, filter);
		}

		static async findOne(filter = {}) {
			return this._find(filter)[0] || null;
		}

		static async findOneAndUpdate(filter, update = {}, options = {}) {
			let document = this._find(filter)[0];
			if (!document && options.upsert) {
				document = new this(filter);
				await document.save();
			}
			if (!document) return null;

			if (update.$set) Object.assign(document, clone(update.$set));
			if (update.$push) {
				for (const [field, value] of Object.entries(update.$push)) {
					if (!Array.isArray(document[field])) document[field] = [];
					document[field].push(clone(value));
				}
			}
			const directUpdate = Object.keys(update).filter(key => !key.startsWith('$'));
			for (const field of directUpdate) document[field] = clone(update[field]);

			this._persist(document);
			return document;
		}

		static async findOneAndDelete(filter) {
			const document = this._find(filter)[0];
			if (!document) return null;
			database.prepare(`DELETE FROM "${table}" WHERE _id = ?`).run(document._id);
			return document;
		}

	}

	return Model;
};