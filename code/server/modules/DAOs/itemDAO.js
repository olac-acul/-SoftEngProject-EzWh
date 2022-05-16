'use strict';
const sqlite = require('sqlite3');

const db = new sqlite.Database('EzWh', (err) => {
    if (err) throw err;
});

exports.dropTable = () => {
    return new Promise((resolve, reject) => {
        const sql = 'DROP TABLE IF EXISTS ITEMS';
        db.run(sql, function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);
        });
    });
}

exports.newTable = () => {
    return new Promise((resolve, reject) => {
        const sql = `CREATE TABLE IF NOT EXISTS ITEMS(ID INTEGER PRIMARY KEY, 
                DESCRIPTION VARCHAR(100), PRICE DOUBLE, SKU_ID INTEGER, SUPPLIER_ID INTEGER)`;
        db.run(sql, function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
}

exports.getItems = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM ITEMS';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const items = rows.map((i) => (
                {
                    id: i.ID,
                    description: i.DESCRIPTION,
                    price: i.PRICE,
                    SKUId: i.SKU_ID,
                    supplierId: i.SUPPLIER_ID,
                }
            ));
            resolve(items);
        });
    });
}

exports.getItemById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM ITEMS WHERE ITEMS.ID = ?';
        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row == undefined)
                resolve('404');
            else {
                const item = {
                    id: row.ID,
                    description: row.DESCRIPTION,
                    price: row.PRICE,
                    SKUId: row.SKU_ID,
                    supplierId: row.SUPPLIER_ID
                };
                resolve(item);
            }
        });
    });
}

exports.validateSKUId = (SKUId, supplierId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM ITEMS WHERE ITEMS.SKU_ID = ? AND ITEMS.SUPPLIER_ID = ?';
        db.get(sql, [SKUId, supplierId], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row == undefined)
                resolve(true);
            else 
                resolve(false);
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

exports.createItem = (item) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO ITEMS(ID, DESCRIPTION, PRICE, SKU_ID, SUPPLIER_ID) VALUES(?, ?, ?, ?, ?)';
        db.run(sql, [item.id, item.description, item.price, item.SKUId, item.supplierId], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
}

exports.modifyItem = (id, newStatus) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE ITEMS
                     SET DESCRIPTION = ?, PRICE = ?
                     WHERE ID = ?`;
        db.run(sql, [newStatus.newDescription, newStatus.newPrice, id], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);
        });
    });
}

exports.deleteItem = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM ITEMS WHERE ITEMS.ID = ?';
        db.run(sql, [id], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);
        });
    });
}