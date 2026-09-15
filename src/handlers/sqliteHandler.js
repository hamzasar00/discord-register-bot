const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const configuredPath = global.client && global.client.settings ? global.client.settings.SQLitePath : '';
const databasePath = configuredPath || process.env.SQLITE_PATH || path.join(process.cwd(), 'data', 'register-bot.sqlite');
fs.mkdirSync(path.dirname(databasePath), { recursive: true });

const database = global.sqliteDatabase || new Database(databasePath);
database.pragma('journal_mode = WAL');
database.pragma('busy_timeout = 5000');

global.sqliteDatabase = database;
console.log(`[DATABASE] SQLite database ready: ${databasePath}`);

module.exports = database;