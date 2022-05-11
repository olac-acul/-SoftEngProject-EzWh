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

    getAllSKUItems() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM SKU_ITEMS';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const SKUItems = rows.map((r) => (
                    {
                        RFID: r.RFID,
                        SKUId: r.SKU_ID,
                        available: r.AVAILABLE,
                        dateOfStock: r.DATE_OF_STOCK
                    }
                ));
                resolve(SKUItems);
            });
        });
    }

    getAllAvailableSKUItems(id) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT RFID, SKU_ID, DATE_OF_STOCK
                         FROM SKU_ITEMS
                         WHERE SKU_ID = ? AND AVAILABLE = TRUE`;
            this.db.all(sql, [id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const SKUItems = rows.map((r) => (
                    {
                        RFID: r.RFID,
                        SKUId: r.SKU_ID,
                        dateOfStock: r.DATE_OF_STOCK
                    }
                ));
                resolve(SKUItems);
            });
        });
    }

    getSKUItem(RFID) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM SKU_ITEMS WHERE RFID = ?`;
            this.db.get(sql, [RFID], (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                const SKUItem = {
                    RFID: row.RFID,
                    SKUId: row.SKU_ID,
                    available: row.AVAILABLE,
                    dateOfStock: row.DATE_OF_STOCK
                };
                resolve(SKUItem);
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

    modifySKUItem(oldRFID, newRFID, newAvailable, newDateOfStock) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE SKU_ITEMS
                         SET RFID = ?, AVAILABLE = ?, DATE_OF_STOCK = ?
                         WHERE RFID = ?`;
            this.db.run(sql, [newRFID, newAvailable, newDateOfStock, oldRFID], function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.changes);
            });
        });
    }

    deleteSKUItem(RFID) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM SKU_ITEMS WHERE RFID = ?';
            this.db.run(sql, [RFID], function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.changes);
            });
        });
    }

}

module.exports = SKUItemDAO;