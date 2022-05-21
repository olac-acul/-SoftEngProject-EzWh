'use strict';
const sqlite = require('sqlite3');

const db = new sqlite.Database('EzWh', (err) => {
    if (err) throw err;
});

exports.dropTable = () => {
    return new Promise((resolve, reject) => {
        const sql = 'DROP TABLE IF EXISTS RESTOCK_ORDERS';
        db.run(sql, function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);
        });
    });
}

exports.newRestockOrderTable = () => {
    return new Promise((resolve, reject) => {
        const sql = `CREATE TABLE IF NOT EXISTS RESTOCK_ORDERS(ID INTEGER PRIMARY KEY AUTOINCREMENT, 
                ISSUE_DATE DATETIME, STATE TEXT, SUPPLIER_ID INTEGER, TRANSPORT_NOTE DATE)`;
        db.run(sql, function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
}

exports.newRestockOrder_join_ProductTable = () => {
    return new Promise((resolve, reject) => {
        const sql = `CREATE TABLE IF NOT EXISTS RESTOCK_ORDER_ITEM(RESTOCK_ORDER_ID INTEGER PRIMARY KEY, ITEM_ID INTEGER PRIMARY KEY, QUANTITY INTEGER)`;
        db.run(sql, function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
}

exports.getRestockOrders = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM RESTOCK_ORDERS`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const restockOrders = rows.map((r) => (
                {
                    id: r.ID,
                    issueDate: r.ISSUE_DATE,
                    state: r.STATE,
                    transportNote: r.TRANSPORT_NOTE,
                    supplierId: r.SUPPILER_ID
                }
            ));
            resolve(restockOrders);
        });
    });
}

exports.getRestockOrderById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT RO.ISSUE_DATE, RO.ID, RO.STATE, RO.SUPPLIER_ID, RO.TRANSPORT_NOTE,
                    I.DESCRIPTION, I.PRICE, ROI.QUANTITY, I.SKU_ID, SI.RFID
                    FROM RESTOCK_ORDERS RO, ITEMS I, SKU_ITEMS SI, RESTOCK_ORDER_ITEM ROI
                    WHERE RO.ID = ? AND RO.ID = ROI.RESTOCK_ORDER_ID AND ROI.ITEM_ID = I.ID
                    AND I.SUPPLIER_ID = RO.SUPPLIER_ID AND I.SKU_ID = SI.SKU_ID`;
        db.all(sql, [id], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            let restockOrder = {};
            const products = [];
            const skuItems = [];
            let id;
            let issueDate;
            let state;
            let supplierId;
            const transportNote = {
                deliveryDate: null
            };
            for (let r in rows) {
                id = rows[r].ID;
                issueDate = rows[r].ISSUE_DATE;
                state = rows[r].STATE;
                supplierId = rows[r].SUPPLIER_ID;
                if (state !== 'ISSUED')
                    transportNote.deliveryDate = rows[r].TRANSPORT_NOTE;
                if (products.filter(p => p.SKUId === rows[r].SKU_ID).length === 0) {
                    products.push({
                        SKUId: rows[r].SKU_ID,
                        description: rows[r].DESCRIPTION,
                        price: rows[r].PRICE,
                        quantity: rows[r].QUANTITY
                    });
                }
                if (state !== 'ISSUED' && state !== 'DELIVERY')
                    skuItems.push({
                        SKUId: rows[r].SKU_ID,
                        rfid: rows[r].RFID
                    });
            }
            if (id == undefined)
                resolve('404');
            else if (state === 'ISSUED') {
                restockOrder =
                {
                    id: id,
                    issueDate: issueDate,
                    state: state,
                    products: products,
                    supplierId: supplierId,
                    skuItems: skuItems
                };
            }
            else {
                restockOrder =
                {
                    id: id,
                    issueDate: issueDate,
                    state: state,
                    products: products,
                    supplierId: supplierId,
                    transportNote: transportNote,
                    skuItems: skuItems
                };
            }
            resolve(restockOrder);
        });
    });
}

exports.checkTestResult = (item) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT T.RESULT
                    FROM TEST_RESULT T, TEST_RESULT_SKUITEM TS
                    WHERE T.RESULT = FALSE AND T.ID = TS.ID_TEST_RESULT AND TS.RFID = ?`;
        db.all(sql, [item.rfid], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            if (rows.length > 0)
                resolve(true);
            else
                resolve(false);
        });
    });
}

exports.createRestockOrder = (restockOrder) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO RESTOCK_ORDERS(ISSUE_DATE, STATE, SUPPLIER_ID) VALUES(?, "ISSUED", ?)'
        db.run(sql, [restockOrder.issueDate, restockOrder.supplierId], (err) => {
            if (err) {
                reject(err);
                return;
            }
        });
        resolve(this.lastID);
    });
}

exports.getItemBySKUId = (SKUId, supplierId) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT ID FROM ITEMS WHERE SKU_ID = ? AND SUPPLIER_ID = ?`;
        db.get(sql, [SKUId, supplierId], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            const itemId = row.ID;
            resolve(itemId);
        });
    });
}

exports.createRestockOrder_join_Product = (restockOrderId, itemId, qty) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO RESTOCK_ORDER_ITEM(RESTOCK_ORDER_ID, ITEM_ID, QUANTITY) VALUES(?, ?, ?)'
        db.run(sql, [restockOrderId, itemId, qty], (err) => {
            if (err) {
                reject(err);
                return;
            }
        });
        resolve(this.lastID);
    });
}

exports.changeStateRestockOrder = (id, newState) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE RESTOCK_ORDERS SET STATE = ? WHERE ID = ?';
        db.run(sql, [newState, id], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);
        });
    });
}

exports.getSKUItem = (RFID) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM SKU_ITEMS WHERE RFID = ?`;
        db.get(sql, [RFID], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row == undefined)
                resolve('404');
            else {
                const SKUItem = {
                    RFID: row.RFID,
                    SKUId: row.SKU_ID,
                    available: row.AVAILABLE,
                    dateOfStock: row.DATE_OF_STOCK
                };
                resolve(SKUItem);
            }
        });
    });
}

exports.addSKUItem = (RFID, SKUId) => {
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

exports.addTransportNoteRestockOrder = (id, deliveryDate) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE RESTOCK_ORDERS SET TRANSPORT_NOTE = ? WHERE ID = ?';
        db.run(sql, [deliveryDate, id], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);
        });
    });
}

exports.deleteRestockOrder = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM RESTOCK_ORDERS WHERE ID = ?';
        db.run(sql, [id], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);
        });
    });
}

exports.deleteRestockOrder_join_Product = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM RESTOCK_ORDER_ITEM WHERE RESTOCK_ORDER_ID = ?';
        db.run(sql, [id], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);
        });
    });

}
