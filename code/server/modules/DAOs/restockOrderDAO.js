class RestockOrderDAO {
    sqlite = require('sqlite3');

    constructor() {
        this.db = new this.sqlite.Database('EzWh', (err) => {
            if (err) throw err;
        });
    }

    dropTable() {
        return new Promise((resolve, reject) => {
            const sql = 'DROP TABLE IF EXISTS RESTOCK_ORDERS';
            this.db.run(sql, function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.changes);
            });
        });
    }

    newRestockOrderTable() {
        return new Promise((resolve, reject) => {
            const sql = `CREATE TABLE IF NOT EXISTS RESTOCK_ORDERS(ID INTEGER PRIMARY KEY AUTOINCREMENT, 
                ISSUE_DATE DATETIME, STATE TEXT, SUPPLIER_ID INTEGER, TRANSPORT_NOTE INTEGER)`;
            this.db.run(sql, function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    getRestockOrders() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM RESTOCK_ORDERS';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const restockOrders = rows.map((r) => (
                    {
                        id: r.ID,
                        issueDate: r.ISSUE_DATE,
                        state: r.STATE,
                        supplierId: r.SUPPLIER_ID,
                        transportNote: r.TRANSPORT_NOTE
                    }
                ));
                resolve(restockOrders);
            });
        });
    }

    getRestockOrderById(id) {
        return new Promise((resolve, reject) => {
            const sql = ``;
            this.db.all(sql, [id, id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!rows) resolve('Not Found');
                else {
                    let id;
                    let issueDate;
                    let state;
                    let supplierId;
                    let transportNote;
                    const products = rows.map(r => {
                        issueDate = r.ISSUE_DATE;
                        id = r.ID;
                        state = r.STATE;
                        supplierId = r.supplierId;
                        transportNote = r.transportNote;
                        return (
                            {
                                SKUId: r.SKU_ID,
                                description: r.DESCRIPTION,
                                price: r.PRICE,
                                RFID: r.RFID
                            });
                    });
                    const returnOrder =
                    {
                        id: id,
                        issueDate: issueDate,
                        state: state,
                        products: products,
                        supplierId: supplierId,
                        transportNote: transportNote,
                        skuItems: skuItems

                    }
                    resolve(returnOrder);
                }
            });
        });
    }

}