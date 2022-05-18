'use strict';
const sqlite = require('sqlite3');

const db = new sqlite.Database('EzWh', (err) => {
    if (err) throw err;
});

exports.dropTable = () => {
    return new Promise((resolve, reject) => {
        const sql = 'DROP TABLE IF EXISTS RETURN_ORDERS';
        db.run(sql, function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);
        });
    });
}

exports.newReturnOrderTable = () => {
    return new Promise((resolve, reject) => {
        const sql = `CREATE TABLE IF NOT EXISTS RETURN_ORDERS(ID INTEGER PRIMARY KEY AUTOINCREMENT, 
                RETURN_DATE DATETIME, RESTOCK_ORDER_ID INTEGER)`;
        db.run(sql, function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
}

exports.newReturnOrder_join_ProductTable = () => {
    return new Promise((resolve, reject) => {
        const sql = `CREATE TABLE IF NOT EXISTS RETURN_ORDERS_PRODUCTS(SKU_ID INTEGER PRIMARY KEY, 
                RETURN_ORDER_ID INTEGER)`;
        db.run(sql, function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
}

exports.getReturnOrders = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM RETURN_ORDERS';
        db.all(sql, [], (err, rows) => {
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

exports.getRestockOrderById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM RESTOCK_ORDERS WHERE ID = ?';
        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            const restockOrder = row;
            if (restockOrder == undefined)
                resolve('404');
            else
                resolve(restockOrder);
        });
    });
}

exports.getItemById = (SKUId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM ITEMS WHERE SKU_ID = ?';
        db.get(sql, [SKUId], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            const item = row;
            if (item == undefined)
                resolve('404');
            else
                resolve(item);
        });
    });
}

exports.getReturnOrderById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT RO.RETURN_DATE, RO.RESTOCK_ORDER_ID, P.SKU_ID, S.DESCRIPTION, S.PRICE, SI.RFID
                     FROM RETURN_ORDERS RO, RETURN_ORDERS_PRODUCTS P, SKU S, SKU_ITEMS SI
                     WHERE RO.ID = ? AND RO.ID = P.RETURN_ORDER_ID AND P.SKU_ID = S.ID AND P.SKU_ID = SI.SKU_ID`;
        db.all(sql, [id], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
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
            if (returnDate === undefined) resolve('Not Found');
            else if (restockOrderId === undefined) resolve('Not Found');
            const returnOrder =
            {
                id: id,
                returnDate: returnDate,
                products: products,
                restockOrderId: restockOrderId
            }
            resolve(returnOrder);
        });
    });
}

exports.createReturnOrder = (returnOrder) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO RETURN_ORDERS(RETURN_DATE, RESTOCK_ORDER_ID) VALUES(?, ?)';
        db.run(sql, [returnOrder.returnDate, returnOrder.restockOrderId], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
}

exports.createReturnOrder_join_Product = (SKUId, returnOrderId) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO RETURN_ORDERS_PRODUCTS(SKU_ID, RETURN_ORDER_ID) VALUES(?, ?)';
        db.run(sql, [SKUId, returnOrderId], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
}

exports.deleteReturnOrder = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM RETURN_ORDERS WHERE RETURN_ORDERS.ID = ?';
        db.run(sql, [id], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);
        });
    });
}

exports.deleteReturnOrder_join_Product = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM RETURN_ORDERS_PRODUCTS WHERE RETURN_ORDERS_PRODUCTS.RETURN_ORDER_ID = ?';
        db.run(sql, [id], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);
        });
    });
}