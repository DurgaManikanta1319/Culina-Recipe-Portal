const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, '../database/culina.db');

// Ensure database directory exists
const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening SQLite database:', err.message);
    } else {
        console.log('Connected to SQLite database (culina.db).');
        db.run('PRAGMA foreign_keys = ON'); // Enable foreign key constraints
    }
});

module.exports = {
    query: (text, params) => {
        return new Promise((resolve, reject) => {
            // Convert PostgreSQL syntax to SQLite syntax
            let sqliteText = text.replace(/ ILIKE /g, ' LIKE ');
            
            // Convert $1, $2, $3... to ?
            sqliteText = sqliteText.replace(/\$\d+/g, '?');

            // SQLite's db.all is used to fetch rows and execute
            db.all(sqliteText, params || [], function(err, rows) {
                if (err) {
                    reject(err);
                } else {
                    // Match the pg response structure { rows: [...] }
                    resolve({ rows: rows || [] });
                }
            });
        });
    },
    getDbInstance: () => db
};
