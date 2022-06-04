'use strict';
const sqlite = require('sqlite3');

const db = new sqlite.Database('EzWh', (err) => {
    if (err) throw err;
});

db.get('PRAGMA busy_timeout = 10000');

exports.dropTable = () => {
    return new Promise((resolve, reject) => {
        const sql = 'DROP TABLE IF EXISTS INTERNAL_ORDERS';
        db.run(sql, function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);
        });
    });
}

exports.newInternalOrdersTable = () => {
    return new Promise((resolve, reject) => {
        const sql = `CREATE TABLE IF NOT EXISTS INTERNAL_ORDERS(ID INTEGER PRIMARY KEY AUTOINCREMENT, CUSTOMER_ID INTEGER, STATE TEXT, ISSUE_DATE DATETIME)`;
        db.run(sql, function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
}

exports.newInternalOrder_join_productTable = () => {
    return new Promise((resolve, reject) => {
        const sql = `CREATE TABLE IF NOT EXISTS INTERNAL_ORDER_PRODUCTS(INTERNAL_ORDER_ID INTEGER NOT NULL, SKU_ID INTEGER NOT NULL, QUANTITY INTEGER, PRIMARY KEY(INTERNAL_ORDER_ID, SKU_ID))`;
        db.run(sql, function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
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

exports.getInternalOrders = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM INTERNAL_ORDERS';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const InternalOrders = rows.map((r) => (
                {
                    id: r.ID,
                    issueDate: r.ISSUE_DATE,
                    state: r.STATE,
                    customerId: r.CUSTOMER_ID
                }
            ));
            resolve(InternalOrders);
        });
    });
}

exports.getInternalOrderById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM INTERNAL_ORDERS IO WHERE IO.ID = ?`
        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row == undefined)
                resolve('404');
            else {
                const preInternalOrder = {
                    id: row.ID,
                    issueDate: row.ISSUE_DATE,
                    state: row.STATE,
                    customerId: row.CUSTOMER_ID
                }
                if (preInternalOrder.state === 'COMPLETED') {
                    const completedSql = `SELECT S.ID SKU_ID, S.DESCRIPTION, S.PRICE, SI.RFID
                                            FROM SKU S, SKU_ITEMS SI, INTERNAL_ORDER_PRODUCTS P
                                            WHERE P.INTERNAL_ORDER_ID = ? AND P.SKU_ID = S.ID AND S.ID = SI.SKU_ID`;
                    db.all(completedSql, [id], (err, rows) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        const products = rows.map(r => (
                            {
                                SKUId: r.SKU_ID,
                                description: r.DESCRIPTION,
                                price: r.PRICE,
                                RFID: r.RFID
                            }
                        ));
                        const internalOrder = {
                            id: preInternalOrder.id,
                            issueDate: preInternalOrder.issueDate,
                            state: preInternalOrder.state,
                            products: products,
                            customerId: preInternalOrder.customerId
                        }
                        resolve(internalOrder);
                    });
                }
                else {
                    const notCompletedSql = `SELECT S.ID SKU_ID, S.DESCRIPTION, S.PRICE, P.QUANTITY
                                         FROM SKU S,
                                         (SELECT SKU_ID, QUANTITY
                                            FROM INTERNAL_ORDER_PRODUCTS PO
                                            WHERE PO.INTERNAL_ORDER_ID = ?) P
                                         WHERE S.ID = P.SKU_ID`;
                    db.all(notCompletedSql, [id], (err, rows) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        const products = rows.map(r => (
                            {

                                SKUId: r.SKU_ID,
                                description: r.DESCRIPTION,
                                price: r.PRICE,
                                qty: r.QUANTITY
                            }
                        ));
                        const internalOrder = {
                            id: preInternalOrder.id,
                            issueDate: preInternalOrder.issueDate,
                            state: preInternalOrder.state,
                            products: products,
                            customerId: preInternalOrder.customerId
                        }
                        resolve(internalOrder);
                    });
                }
            }
        });
    });
}

exports.createInternalOrder = (internalOrder) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO INTERNAL_ORDERS(STATE, ISSUE_DATE, CUSTOMER_ID) VALUES("ISSUED" ,?, ?)';
        db.run(sql, [internalOrder.issueDate, internalOrder.customerId], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
}

exports.createInternalOrder_join_Product = (id, SKUId, qty) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO INTERNAL_ORDER_PRODUCTS(INTERNAL_ORDER_ID, SKU_ID, QUANTITY) VALUES(?, ?, ?)`;
        db.run(sql, [id, SKUId, qty], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
}

exports.changeStateInternalOrder = (id, newState) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE INTERNAL_ORDERS SET STATE = ? WHERE ID = ?'
        db.run(sql, [newState, id], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);

        });
    });
}

exports.addSKUItem = (SKUId, RFID) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO SKU_ITEMS(RFID, SKU_ID, AVAILABLE) VALUES(?, ?, 1)';
        db.run(sql, [RFID, SKUId], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
}

exports.deleteInternalOrder = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM INTERNAL_ORDERS WHERE INTERNAL_ORDERS.ID = ?';
        db.run(sql, [id], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);
        });
    });
}

exports.deleteInternalOrder_join_Product = (id) => {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM INTERNAL_ORDER_PRODUCTS WHERE INTERNAL_ORDER_PRODUCTS.INTERNAL_ORDER_ID = ?`
        db.run(sql, [id], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);
        })
    });
}

exports.deleteInternalOrders = () => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM INTERNAL_ORDERS';
        db.run(sql, [], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        })
    })
};