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
                ISSUE_DATE DATETIME, STATE TEXT, SUPPLIER_ID INTEGER, TRANSPORT_NOTE INTEGER)`;
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
        // duoble join, 3 tables to get the list of SKU
        const sql = `SELECT RO.ISSUE_DATE ISSUE_DATE, RO.ID ID, RO.STATE STATE, RO.SUPPLIER_ID SUPPILER_ID, RO.TRANSPORT_NOTE TRANSPORT_NOTE, P.DESCRIPTION DESCRIPTION, P.PRICE PRICE, P.QUANTITY QUANTITY, P.SKU_ID SKU_ID, SI.RFID RFID
            FROM RESTOCK_ORDERS AS RO, SKU_ITEMS AS SI, (
                SELECT I.DESCRIPTION DESCRIPTION, I.PRICE PRICE, ROI.QUANTITY QUANTITY, I.SKU_ID SKU_ID, ROI.RESTOCK_ORDER_ID RESTOCK_ORDER_ID
                FROM ITEMS AS I, RESTOCK_ORDER_ITEM AS ROI
                WHERE I.ID = ROI.ITEM_ID) AS P
            WHERE P.SKU_ID = SI.SKU_ID AND RO.ID = P.RESTOCK_ORDER_ID`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const restockOrders = [];
            let products = [];
            let skuItems = [];
            let id = 0;
            let issueDate;
            let state;
            let supplierId;
            let transportNote = {
                deliveryDate: null
            };
            for (let r in rows) {
                if (id === 0) {
                    id = rows[r].ID;
                    issueDate = rows[r].ISSUE_DATE;
                    supplierId = rows[r].SUPPLIER_ID;
                    state = rows[r].STATE;
                    transportNote.deliveryDate = rows[r].TRANSPORT_NOTE;
                    products.push({
                        SKUId: rows[r].SKU_ID,
                        description: rows[r].DESCRIPTION,
                        price: rows[r].PRICE,
                        quantity: rows[r].QUANTITY
                    });
                    skuItems.push({
                        skuId: rows[r].skuId,
                        rfid: rows[r].rfid
                    })
                }
                else if (id === rows[r].ID) {
                    products.push({
                        SKUId: rows[r].SKU_ID,
                        description: rows[r].DESCRIPTION,
                        price: rows[r].PRICE,
                        quantity: rows[r].QUANTITY
                    });
                }
                else if (id !== rows[r].ID) {
                    restockOrders.push({
                        id: id,
                        issueDate: issueDate,
                        state: state,
                        products: products,
                        supplierId: supplierId,
                        transportNote: transportNote,
                        skuItems: skuItems
                    });
                    products = [];
                    skuItems = [];
                    id = rows[r].ID;
                    issueDate = rows[r].ISSUE_DATE;
                    supplierId = rows[r].SUPPLIER_ID;
                    state = rows[r].STATE;
                    transportNote.deliveryDate = rows[r].TRANSPORT_NOTE;
                    products.push({
                        SKUId: rows[r].SKU_ID,
                        description: rows[r].DESCRIPTION,
                        price: rows[r].PRICE,
                        quantity: rows[r].QUANTITY
                    });
                }
            }
            restockOrders.push({
                id: id,
                issueDate: issueDate,
                state: state,
                products: products,
                supplierId: supplierId,
                transportNote: transportNote,
                skuItems: skuItems
            });

            resolve(restockOrders);
        });
    });
}

exports.getRestockOrderById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT RO.ISSUE_DATE ISSUE_DATE, RO.ID ID, RO.STATE STATE, RO.SUPPLIER_ID SUPPILER_ID, RO.TRANSPORT_NOTE TRANSPORT_NOTE, P.DESCRIPTION DESCRIPTION, P.PRICE PRICE, P.QUANTITY QUANTITY, P.SKU_ID SKU_ID, SI.RFID RFID
            FROM RESTOCK_ORDERS AS RO, SKU_ITEMS AS SI, (
                SELECT I.DESCRIPTION DESCRIPTION, I.PRICE PRICE, ROI.QUANTITY QUANTITY, I.SKU_ID SKU_ID, ROI.RESTOCK_ORDER_ID RESTOCK_ORDER_ID
                FROM ITEMS AS I, RESTOCK_ORDER_ITEM AS ROI
                WHERE I.ID = ROI.ITEM_ID) AS P
            WHERE P.SKU_ID = SI.SKU_ID AND RO.ID = P.RESTOCK_ORDER_ID AND RO.ID = ?`;
        db.all(sql, [id], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            let products = [];
            let skuItems = [];
            let id;
            let issueDate;
            let state;
            let supplierId;
            let transportNote = {
                deliveryDate: null
            };
            for (let r in rows) {
                id = rows[r].ID;
                issueDate = rows[r].ISSUE_DATE;
                state = rows[r].STATE;
                supplierId = rows[r].SUPPLIER_ID;
                transportNote.deliveryDate = rows[r].TRANSPORT_NOTE;
                products.push({
                    SKUId: rows[r].SKU_ID,
                    description: rows[r].DESCRIPTION,
                    price: rows[r].PRICE,
                    quantity: rows[r].QUANTITY
                });
                skuItems.push({
                    SKUId: rows[r].SKU_ID,
                    description: rows[r].DESCRIPTION,
                    price: rows[r].PRICE,
                    quantity: rows[r].QUANTITY
                });
            }
            const restockOrder =
            {
                id: id,
                issueDate: issueDate,
                state: state,
                products: products,
                supplierId: supplierId,
                transportNote: transportNote,
                skuItems: skuItems

            };

            resolve(restockOrder);
        });
    });
}

exports.changeStateRestockOrder = (id, newState) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE RESTOCK_ORDER SET RESTOCK_ORDER.STATE = ? WHERE RESTOCK_ORDER.ID = ?';
        db.run(sql, [newState, id], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);

        });
    });
}

exports.createJoinSkuItems = (ROid, SIid) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO RESTOCK_ORDER_SKU_ITEM(RESTOCK_ORDER_ID, SKU_ITEM_ID) VALUES(?, ?)'
        db.run(sql, [ROid, SIid], (err) => {
            if (err) {
                reject(err);
                return;
            }
        });
        resolve(this.changes);
    });
}

exports.addTransportNoteRestockOrder = (ROid, newTransportNote) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE TRANSPORT_NOTE SET RESTOCK_ORDER.TRANSPORT_NOTE = ? WHERE RESTOCK_ORDER.ID = ?';
        db.run(sql, [newTransportNote, ROid], (err) => {
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
        const sql = 'DELETE FROM RESTOCK_ORDERS WHERE RESTOCK_ORDERS.ID = ?';
        db.run(sql, [id], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);
        });
    });
}

exports.deleteRestockOrderJoinSkuItems = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM RESTOCK_ORDERS_SKU_ITEMS) WHERE RESTOCK_ORDERS.ID = ?';
        db.run(sql, [id], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);
        });
    });
}

exports.deleteRestockOrderJoinItems = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM RESTOCK_ORDERS_ITEMS) WHERE RESTOCK_ORDERS.ID = ?';
        db.run(sql, [id], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);
        });
    });

}
