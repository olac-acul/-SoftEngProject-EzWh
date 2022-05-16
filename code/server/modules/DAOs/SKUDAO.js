class SKUDAO{
    sqlite = require('sqlite3');

    constructor() {
        this.db = new this.sqlite.Database('EzWh', (err) => {
            if (err) throw err;
        });
    }

    //Not tested
    newSKUTable() {
        return new Promise((resolve, reject) => {
            const sql = `CREATE TABLE IF NOT EXISTS SKU (
                ID	INTEGER NOT NULL UNIQUE,
                DESCRIPTION	TEXT NOT NULL,
                WEIGHT	INTEGER NOT NULL,
                VOLUME	INTEGER NOT NULL,
                NOTES	TEXT NOT NULL,
                POSITION	TEXT,
                AVAILABLE_QUANTITY	INTEGER NOT NULL,
                PRICE	REAL NOT NULL,
                TEST_DESCRIPTORS	TEXT,
                PRIMARY KEY(ID AUTOINCREMENT)
            )`;
            this.db.run(sql, function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    dropTable() {
        return new Promise((resolve, reject) => {
            const sql = 'DROP TABLE IF EXISTS SKU';
            this.db.run(sql, function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.changes);
            });
        });
    }

    getAllSKUs() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM SKU';
            this.db.all(sql, [], (err, rows) => {
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

    getSKU(ID) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM SKU WHERE ID = ?`;
            this.db.get(sql, [ID], (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
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
            });
        });
    }

    addSKU(SKU) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO SKU(DESCRIPTION, WEIGHT, VOLUME, NOTES, PRICE, AVAILABLE_QUANTITY) VALUES(?, ?, ?, ?, ?, ?)';
            this.db.run(sql, [SKU.description, SKU.weight, SKU.volume, SKU.notes, SKU.price, SKU.availableQuantity], function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    modifySKU(id, newDescription, newWeight, newVolume, newPrice, newAvailableQuantity){
        return new Promise((resolve, reject) => {
            const sql = `UPDATE SKU
                             SET DESCRIPTION = ?, WEIGHT = ?, VOLUME = ?, PRICE = ?, AVAILABLE_QUANTITY = ?
                             WHERE ID = ?`;
            db.run(sql, [newDescription, newWeight, newVolume, newPrice, newAvailableQuantity, id], function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.changes);
            });
        });
    }

    modifySKUposition(id, newPosition){
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

    deleteSKU(ID) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM SKU WHERE ID = ?';
            this.db.run(sql, [ID], function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.changes);
            });
        });
    }

}

module.exports = SKUDAO;