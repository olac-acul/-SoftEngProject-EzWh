'use strict';
const sqlite = require('sqlite3');

const db = new sqlite.Database('EzWh', (err) => {
    if (err) throw err;
});

db.get('PRAGMA busy_timeout = 30000');

exports.newSKUTable = () => {
    return new Promise((resolve, reject) => {
        const sql = `CREATE TABLE IF NOT EXISTS SKU (
                ID INTEGER PRIMARY KEY AUTOINCREMENT,
                DESCRIPTION	TEXT NOT NULL,
                WEIGHT INTEGER,
                VOLUME INTEGER,
                NOTES TEXT,
                POSITION TEXT,
                AVAILABLE_QUANTITY INTEGER,
                PRICE REAL NOT NULL)`;
        db.run(sql, function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
}

exports.dropTable = () => {
    return new Promise((resolve, reject) => {
        const sql = 'DROP TABLE IF EXISTS SKU';
        db.run(sql, function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);
        });
    });
}

exports.getAllSKUs = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM SKU';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const SKUs = rows.map((r) => (
                {
                    id: r.ID,
                    description: r.DESCRIPTION,
                    weight: r.WEIGHT,
                    volume: r.VOLUME,
                    notes: r.NOTES,
                    position: r.POSITION,
                    availableQuantity: r.AVAILABLE_QUANTITY,
                    price: r.PRICE,
                    testDescriptors: r.TEST_DESCRIPTORS
                }
            ));
            resolve(SKUs);
        });
    });
}

exports.getSKU = (ID) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM SKU WHERE ID = ?`;
        db.get(sql, [ID], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row == undefined)
                resolve('404');
            else {
                const SKU = {
                    id: row.ID,
                    description: row.DESCRIPTION,
                    weight: row.WEIGHT,
                    volume: row.VOLUME,
                    notes: row.NOTES,
                    position: row.POSITION,
                    availableQuantity: row.AVAILABLE_QUANTITY,
                    price: row.PRICE,
                    testDescriptors: row.TEST_DESCRIPTORS
                };
                resolve(SKU);
            }
        });
    });
}

exports.getSKUPosition = (id) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT POSITION FROM SKU WHERE ID = ?`;
        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row === undefined)
                resolve('404');
            else {
                const skuPosition = row.POSITION;
                if (skuPosition === null)
                    resolve('422');
                else
                    resolve(skuPosition);
            }
        });
    });
}

exports.getPositionById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT MAX_WEIGHT, MAX_VOLUME
                     FROM POSITIONS WHERE POSITION_ID = ?`;
        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row === undefined)
                resolve('404');
            else {
                const position = {
                    maxWeight: row.MAX_WEIGHT,
                    maxVolume: row.MAX_VOLUME
                };
                resolve(position);
            }
        });
    });
}

exports.addSKU = (SKU) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO SKU(DESCRIPTION, WEIGHT, VOLUME, NOTES, PRICE, AVAILABLE_QUANTITY) VALUES(?, ?, ?, ?, ?, ?)';
        db.run(sql, [SKU.description, SKU.weight, SKU.volume, SKU.notes, SKU.price, SKU.availableQuantity], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
}

exports.modifySKU = (id, newState) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE SKU
                             SET DESCRIPTION = ?, WEIGHT = ?, VOLUME = ?, NOTES = ?, PRICE = ?, AVAILABLE_QUANTITY = ?
                             WHERE ID = ?`;
        db.run(sql, [newState.newDescription, newState.newWeight, newState.newVolume, newState.newNotes, newState.newPrice, newState.newAvailableQuantity, id], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);
        });
    });
}

exports.modifyPositionWeightVolume = (skuPosition, newWeight, newVolume) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE POSITIONS
                     SET OCCUPIED_WEIGHT = ?, OCCUPIED_VOLUME = ? 
                     WHERE POSITION_ID = ?`;
        db.run(sql, [newWeight, newVolume, skuPosition], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);
        });
    });
}

exports.modifySKUPosition = (id, newPosition) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE SKU
                             SET POSITION = ?
                             WHERE ID = ?`;
        db.run(sql, [newPosition, id], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);
        });
    });
}

exports.deleteSKU = (ID) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM SKU WHERE ID = ?';
        db.run(sql, [ID], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);
        });
    });
}

exports.deleteSKUs = () => {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM SKUS';
      db.run(sql, [], function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(true);
      })
    })
  };