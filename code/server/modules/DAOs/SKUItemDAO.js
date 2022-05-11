class SKUItemDAO {
    sqlite = require('sqlite3');

    constructor() {
        this.db = new this.sqlite.Database('EzWh', (err) => {
            if (err) throw err;
        });
    }

    dropTable() {
        return new Promise((resolve, reject) => {
            const sql = 'DROP TABLE IF EXISTS SKU_ITEMS';
            this.db.run(sql, function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.changes);
            });
        });
    }

    newSKUItemTable() {
        return new Promise((resolve, reject) => {
            const sql = `CREATE TABLE IF NOT EXISTS SKU_ITEMS(RFID VARCHAR(32) PRIMARY KEY, 
            SKU_ID INTEGER, AVAILABLE BOOL, DATE_OF_STOCK DATETIME)`;
            this.db.run(sql, function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    addSKUItem(SKUItem) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO SKU_ITEMS(RFID, SKU_ID, DATE_OF_STOCK, AVAILABLE) VALUES(?, ?, ?, 0)';
            this.db.run(sql, [SKUItem.RFID, SKUItem.SKUId, SKUItem.DateOfStock], function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

}

module.exports = SKUItemDAO;