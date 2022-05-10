class ItemDAO {
    sqlite = require('sqlite3');

    constructor() {
        this.db = new this.sqlite.Database('EzWh', (err) => {
            if (err) throw err;
        });
    }

    dropTable() {
        return new Promise((resolve, reject) => {
            const sql = 'DROP TABLE IF EXISTS ITEMS';
            this.db.run(sql, function(err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.changes);
            });
        });
    }

    newTable() {
        return new Promise((resolve, reject) => {
            const sql = `CREATE TABLE IF NOT EXISTS ITEMS(ID INTEGER PRIMARY KEY, 
                DESCRIPTION VARCHAR(100), PRICE DOUBLE, SKU_ID INTEGER, SUPPLIER_ID INTEGER)`;
            this.db.run(sql, function(err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    getItems() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM ITEMS';
            this.db.all(sql, [], (err, rows) => {
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

    getItemById(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM ITEMS WHERE ITEMS.ID = ?';
            this.db.get(sql, [id], (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!row) resolve('Not Found');
                else {
                    const item = {
                        id: i.ID,
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

    createItem(item) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO ITEMS(ID, DESCRIPTION, PRICE, SKU_ID, SUPPLIER_ID) VALUES(?, ?, ?, ?, ?)';
            this.db.run(sql, [item.id, item.description, item.price, item.SKUId, item.supplierId], function(err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    

    deleteItem(id) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM ITEMS WHERE ITEMS.ID = ?';
            this.db.run(sql, [id], function(err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.changes);
            });
        });
    }

}

module.exports = ItemDAO;