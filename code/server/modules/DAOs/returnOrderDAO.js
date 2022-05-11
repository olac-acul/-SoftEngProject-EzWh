class ReturnOrderDAO {
    sqlite = require('sqlite3');

    constructor() {
        this.db = new this.sqlite.Database('EzWh', (err) => {
            if (err) throw err;
        });
    }

    // newItemTable() {
    //     return new Promise((resolve, reject) => {
    //         const sql = `CREATE TABLE IF NOT EXISTS ITEMS(ID INTEGER PRIMARY KEY AUTOINCREMENT, 
    //             DESCRIPTION VARCHAR(100), PRICE FLOAT, SKU_ID INTEGER, SUPPLIER_ID INTEGER)`;
    //         this.db.run(sql, function (err) {
    //             if (err) {
    //                 reject(err);
    //                 return;
    //             }
    //             resolve(this.lastID);
    //         });
    //     });
    // }

    // createItem() {
    //     return new Promise((resolve, reject) => {
    //         const sql = 'INSERT INTO ITEMS(DESCRIPTION, PRICE, SKU_ID, SUPPLIER_ID) VALUES("d2", 10.99, 180, 1)';
    //         this.db.run(sql, [], function (err) {
    //             if (err) {
    //                 reject(err);
    //                 return;
    //             }
    //             resolve(this.lastID);
    //         });
    //     });
    // }

    dropTable() {
        return new Promise((resolve, reject) => {
            const sql = 'DROP TABLE IF EXISTS RETURN_ORDERS';
            this.db.run(sql, function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.changes);
            });
        });
    }

    newReturnOrderTable() {
        return new Promise((resolve, reject) => {
            const sql = `CREATE TABLE IF NOT EXISTS RETURN_ORDERS(ID INTEGER PRIMARY KEY AUTOINCREMENT, 
                RETURN_DATE DATETIME, RESTOCK_ORDER_ID INTEGER)`;
            this.db.run(sql, function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    newReturnOrder_join_ProductTable() {
        return new Promise((resolve, reject) => {
            const sql = `CREATE TABLE IF NOT EXISTS RETURN_ORDERS_PRODUCTS(SKU_ID INTEGER PRIMARY KEY, 
                RETURN_ORDER_ID INTEGER)`;
            this.db.run(sql, function (err) {
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
                        restockOrderId: r.RESTOCK_ORDER_ID
                    }
                ));
                resolve(returnOrders);
            });
        });
    }

    getReturnOrderById(id) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT RO.RETURN_DATE RETURN_DATE, PR.SKU_ID, PR.DESCRIPTION, PR.PRICE, PR.RFID RFID, RO.RESTOCK_ORDER_ID RESTOCK_ORDER_ID
                         FROM RETURN_ORDERS RO, 
                         (SELECT I.SKU_ID SKU_ID, I.DESCRIPTION DESCRIPTION, I.PRICE PRICE, S.RFID RFID
                          FROM ITEMS I, SKU_ITEMS S
                          WHERE I.SKU_ID = S.SKU_ID
                          AND I.SKU_ID IN
                          (SELECT SKU_ID
                           FROM RETURN_ORDERS_PRODUCTS AS P 
                           WHERE P.RETURN_ORDER_ID = ?)) PR
                         WHERE RO.ID = ?`
            this.db.all(sql, [id, id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!rows) resolve('Not Found');
                else {
                    let returnDate;
                    let restockOrderId;
                    const products = rows.map(r => {
                        returnDate = r.RETURN_DATE;
                        restockOrderId = r.RESTOCK_ORDER_ID;
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
                        returnDate: returnDate,
                        products: products,
                        restockOrderId: restockOrderId
                    }
                    resolve(returnOrder);
                }
            });
        });
    }

    createReturnOrder(returnOrder) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO RETURN_ORDERS(RETURN_DATE, RESTOCK_ORDER_ID) VALUES(?, ?)';
            this.db.run(sql, [returnOrder.returnDate, returnOrder.restockOrderId], function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    createReturnOrder_join_Product(SKUId, returnOrderId) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO RETURN_ORDERS_PRODUCTS(SKU_ID, RETURN_ORDER_ID) VALUES(?, ?)';
            this.db.run(sql, [SKUId, returnOrderId], function (err) {
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
            this.db.run(sql, [id], function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.changes);
            });
        });
    }

    deleteReturnOrder_join_Product(id) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM RETURN_ORDERS_PRODUCTS WHERE RETURN_ORDERS_PRODUCTS.RETURN_ORDER_ID = ?';
            this.db.run(sql, [id], function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.changes);
            });
        });
    }

}

module.exports = ReturnOrderDAO;