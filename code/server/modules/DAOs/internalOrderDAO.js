'use strict';
const sqlite = require('sqlite3');

const db = new sqlite.Database('EzWh', (err) => {
    if (err) throw err;
});


exports.dropTable = () => {
    return new Promise((resolve, reject) => {
        const sql = 'DROP TABLE IF EXIST INTERNAL_ORDERS';
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

exports.getInternalOrder = () => {
    return new Promise((resolve, reject) => {
        // duoble join, 3 tables to get the list of SKU
        const sql = `SELECT IO.ISSUE_DATE ISSUE_DATE, IO.ID ID, IO.STATE STATE, IO.CUSTOMER_ID CUSTOMER_ID, PR.DESCRIPTION DESCRIPTION, PR.PRICE PRICE, PR.SKU_ID SKU_ID
            FROM INTERNAL_ORDERS AS IO, 
            (SELECT I.SKU_ID SKU_ID, I.DESCRIPTION DESCRIPTION, I.PRICE PRICE, S.INTERNAL_ORDER_ID INTERNAL_ORDER_ID
            FROM ITEMS I, INTERNAL_ORDER_PRODUCTS S
            WHERE I.SKU_ID = S.SKU_ID) AS PR
            WHERE IO.ID = PR.INTERNAL_ORDER_ID`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const internalOrders = [];
            let products = [];
            let id = 0;
            let issueDate;
            let state;
            let customerId;
            for (let r in rows) {
                if (id === 0) {
                    id = rows[r].ID;
                    issueDate = rows[r].ISSUE_DATE;
                    customerId = rows[r].CUSTOMER_ID;
                    state = rows[r].STATE;
                    products.push({
                        SKUId: rows[r].SKU_ID,
                        description: rows[r].DESCRIPTION,
                        price: rows[r].PRICE
                    });
                }
                else if (id === rows[r].ID) {
                    products.push({
                        SKUId: rows[r].SKU_ID,
                        description: rows[r].DESCRIPTION,
                        price: rows[r].PRICE
                    });
                }
                else if (id !== rows[r].ID) {
                    internalOrders.push({
                        id: id,
                        issueDate: issueDate,
                        state: state,
                        products: products,
                        customerId: customerId
                    });
                    products = [];
                    id = rows[r].ID;
                    issueDate = rows[r].ISSUE_DATE;
                    customerId = rows[r].CUSTOMER_ID;
                    state = rows[r].STATE;
                    products.push({
                        SKUId: rows[r].SKU_ID,
                        description: rows[r].DESCRIPTION,
                        price: rows[r].PRICE
                    });
                }
            }
            internalOrders.push({
                id: id,
                issueDate: issueDate,
                state: state,
                products: products,
                customerId: customerId
            });

            resolve(internalOrders);
        });
    });
}

exports.getInternalOrderById = (id) => {
    return new Promise((resolve, reject) => {
        // duoble join, 3 tables to get the list of SKU
        const sql = `SELECT IO.ISSUE_DATE ISSUE_DATE, IO.ID ID, IO.STATE STATE, IO.CUSTOMER_ID CUSTOMER_ID, PR.DESCRIPTION DESCRIPTION, PR.PRICE PRICE, PR.SKU_ID SKU_ID
            FROM INTERNAL_ORDERS AS IO, 
            (SELECT I.SKU_ID SKU_ID, I.DESCRIPTION DESCRIPTION, I.PRICE PRICE, S.INTERNAL_ORDER_ID INTERNAL_ORDER_ID
            FROM ITEMS I, INTERNAL_ORDER_PRODUCTS S
            WHERE I.SKU_ID = S.SKU_ID) AS PR
            WHERE IO.ID = PR.INTERNAL_ORDER_ID AND IO.ID = ?`;
        db.all(sql, [id], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            let products = [];
            let id;
            let issueDate;
            let state;
            let customerId;
            for (let r in rows) {
                id = rows[r].ID;
                issueDate = rows[r].ISSUE_DATE;
                state = rows[r].STATE;
                customerId = rows[r].CUSTOMER_ID;
                products.push({
                    SKUId: rows[r].SKU_ID,
                    description: rows[r].DESCRIPTION,
                    price: rows[r].PRICE
                });
            }
            const internalOrder =
            {
                id: id,
                issueDate: issueDate,
                state: state,
                products: products,
                customerId: customerId
            };

            resolve(internalOrder);
        });
    });
}

exports.createInternalOrder = (internalOrder) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO INTERNAL_ORDERS(STATE, ISSUE_DATE, CUSTOMER_ID) VALUES(? ,?, ?)';
        db.run(sql, [internalOrder.state, internalOrder.issueDate, internalOrder.customerId], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
}

exports.createJoinProduct = (joinIOP) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO INTERNAL_ORDER_PRODUCTS(INTERNAL_ORDER_ID, SKU_ID, QUANTITY) VALUES(?, ?, ?)`;

        db.run(sql, [joinIOP.internalOrder_id, joinIOP.skuId, joinIOP.quantity], (err) => {
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
        db.run(sql, [id], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);
        });
    });
}

exports.deleteJoinProduct = (id) => {
    return new Promise((resole, reject) => {
        const sql = `DELETE FROM INTERNAL_ORDER_PRODUCTS WHERE INTERNAL_ORDER_PRODUCTS.INTERNAL_ORDER_ID = ?`
        db.run(sql, [id], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);
        })
    });
}

exports.changeStateInternalOrder = (id, newState) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE INTERNAL_ORDERS SET INTERNAL_ORDERS.STATE = ? WHERE INTERNAL_ORDERS.ID = ?'
        db.run(sql, [newState, id], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);

        });
    });
}

exports.addSkuToInternalOrder = (id, skuList) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO INT_ORD_SKU(ORD_ID, RFID) VALUES(?, ?)';
        skuList.forEach(sku => {
            db.run(sql, [id, sku.rfid], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    });
}
