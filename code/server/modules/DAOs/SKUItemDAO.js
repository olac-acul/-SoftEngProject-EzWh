'use strict';
const sqlite = require('sqlite3');

const db = new sqlite.Database('EzWh', (err) => {
    if (err) throw err;
});

db.get('PRAGMA busy_timeout = 30000');

exports.dropTable = () => {
    return new Promise((resolve, reject) => {
        const sql = 'DROP TABLE IF EXISTS SKU_ITEMS';
        db.run(sql, function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);
        });
    });
}

exports.newSKUItemTable = () => {
    return new Promise((resolve, reject) => {
        const sql = `CREATE TABLE IF NOT EXISTS SKU_ITEMS(RFID VARCHAR(32) PRIMARY KEY, 
            SKU_ID INTEGER, AVAILABLE BOOL, DATE_OF_STOCK DATETIME)`;
        db.run(sql, function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
}

exports.getAllSKUItems = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM SKU_ITEMS';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const SKUItems = rows.map((r) => (
                {
                    RFID: r.RFID,
                    SKUId: r.SKU_ID,
                    Available: r.AVAILABLE,
                    DateOfStock: r.DATE_OF_STOCK
                }
            ));
            resolve(SKUItems);
        });
    });
}

exports.getAllAvailableSKUItems = (id) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT RFID, SKU_ID, DATE_OF_STOCK
                         FROM SKU_ITEMS
                         WHERE SKU_ID = ? AND AVAILABLE = TRUE`;
        db.all(sql, [id], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const SKUItems = rows.map((r) => (
                {
                    RFID: r.RFID,
                    SKUId: r.SKU_ID,
                    DateOfStock: r.DATE_OF_STOCK
                }
            ));
            if (SKUItems.length === 0)
                resolve('404');
            else
                resolve(SKUItems);
        });
    });
}

exports.getSKUItem = (RFID) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM SKU_ITEMS WHERE RFID = ?`;
        db.get(sql, [RFID], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row == undefined)
                resolve('404');
            else {
                const SKUItem = {
                    RFID: row.RFID,
                    SKUId: row.SKU_ID,
                    Available: row.AVAILABLE,
                    DateOfStock: row.DATE_OF_STOCK
                };
                resolve(SKUItem);
            }
        });
    });
}

exports.searchSKU = (id) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM SKU WHERE ID = ?`;
        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row == undefined)
                resolve(false);
            else
                resolve(true);
        });
    });
}

exports.addSKUItem = (SKUItem) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO SKU_ITEMS(RFID, SKU_ID, DATE_OF_STOCK, AVAILABLE) VALUES(?, ?, ?, 0)';
        db.run(sql, [SKUItem.RFID, SKUItem.SKUId, SKUItem.DateOfStock], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
}

exports.modifySKUItem = (oldRFID, newStatus) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE SKU_ITEMS
                         SET RFID = ?, AVAILABLE = ?, DATE_OF_STOCK = ?
                         WHERE RFID = ?`;
        db.run(sql, [newStatus.newRFID, newStatus.newAvailable, newStatus.newDateOfStock, oldRFID], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);
        });
    });
}

exports.deleteSKUItem = (RFID) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM SKU_ITEMS WHERE RFID = ?';
        db.run(sql, [RFID], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);
        });
    });
}

exports.deleteSKUItems = () => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM SKU_ITEMS';
        db.run(sql, [], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        });
    });
}