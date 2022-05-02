const { param } = require('express/lib/request');

class ReturnOrder {
    sqlite = require('sqlite3');

    constructor() {
        this.db = new this.sqlite.Database('EzWh', (err) => {
            if (err) throw err;
        });
    }

    dropTable() {
        return new Promise((resolve, reject)  => {
            const sql = 'DROP TABLE IF EXISTS RETURN_ORDERS';
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    newTable() {
        return new Promise((resolve, reject)  => {
            const sql = `CREATE TABLE IF NOT EXISTS RETURN_ORDERS(ID INTEGER PRIMARY KEY AUTOINCREMENT, 
                RETURN_DATE DATETIME, PRODUCTS INTEGER[], RESTOCK_ORDER_ID INTEGER)`;
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    getReturnOrders() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM RETURN_ORDERS';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const returnOrders = rows.map((r) => (
                    {
                        id: r.ID,
                        returnDate: r.RETURN_DATE,
                        products: r.PRODUCTS,
                        restockOrderId: r.RESTOCK_ORDER_ID
                    }
                ));
                resolve(returnOrders);
            });
        });
    }

    getReturnOrderById(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM RETURN_ORDERS WHERE RETURN_ORDERS.ID = ?';
            this.db.get(sql, [id], (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                const returnOrder = {
                    returnDate: row.RETURN_DATE,
                    products: row.PRODUCTS,
                    restockOrderId: row.RESTOCK_ORDER_ID
                };
                resolve(returnOrder);
            });
        });
    }

    createReturnOrder(returnOrder) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO RETURN_ORDERS(RETURN_DATE, PRODUCTS, RESTOCK_ORDER_ID) VALUES(?, ?, ?)';
            this.db.run(sql, [returnOrder.returnDate, returnOrder.products, returnOrder.restockOrderId], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    deleteReturnOrder(id) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM RETURN_ORDERS WHERE RETURN_ORDERS.ID = ?';
            this.db.run(sql, [id], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }
        
}

module.exports = ReturnOrder;
