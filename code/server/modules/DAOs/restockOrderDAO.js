'use strict';
const sqlite = require('sqlite3');

const db = new sqlite.Database('EzWh', (err) => {
    if (err) throw err;
});

db.get('PRAGMA busy_timeout = 30000');

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

exports.resetAutoincrement = () => {
    return new Promise((resolve, reject) => {
        // const sql = `UPDATE 'sqlite_sequence' SET 'seq' = 0 WHERE 'name' = 'RESTOCK_ORDERS'`;
        // const sql = `DELETE FROM 'sqlite_sequence' WHERE 'name' = 'RESTOCK_ORDERS'`;
        const sql = `UPDATE 'sqlite_sequence' SET 'seq' = (SELECT MAX('ID') FROM 'RESTOCK_ORDERS') WHERE 'name' = 'RESTOCK_ORDERS'`;
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

// exports.newRestockOrder_join_ProductTable = () => {
//     return new Promise((resolve, reject) => {
//         const sql = `CREATE TABLE IF NOT EXISTS RESTOCK_ORDER_SKU(RESTOCK_ORDER_ID INTEGER, SKU_ID INTEGER, QUANTITY INTEGER, PRIMARY KEY(RESTOCK_ORDER_ID, SKU_ID))`;
//         db.run(sql, function (err) {
//             if (err) {
//                 reject(err);
//                 return;
//             }
//             resolve(this.lastID);
//         });
//     });
// }

exports.newRestockOrder_join_ProductTable = () => {
    return new Promise((resolve, reject) => {
        const sql = `CREATE TABLE IF NOT EXISTS RESTOCK_ORDER_SKU(RESTOCK_ORDER_ID INTEGER, SKU_ID INTEGER, DESCRIPTION TEXT, PRICE REAL, QUANTITY INTEGER,, ITEM_ID INTEGER, RFID VARCHAR(32), PRIMARY KEY(RESTOCK_ORDER_ID, SKU_ID, RFID))`;
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
                    supplierId: r.SUPPILER_ID,
                    transportNote: r.TRANSPORT_NOTE
                }
            ));
            resolve(restockOrders);
        });
    });
}

// exports.getRestockOrderById = (id) => {
//     return new Promise((resolve, reject) => {
//         const sql = `SELECT RO.ISSUE_DATE, RO.ID, RO.STATE, RO.SUPPLIER_ID, RO.TRANSPORT_NOTE,
//                     I.DESCRIPTION, I.PRICE, ROI.QUANTITY, I.SKU_ID, SI.RFID
//                     FROM RESTOCK_ORDERS RO, ITEMS I, SKU_ITEMS SI, RESTOCK_ORDER_SKU ROI
//                     WHERE RO.ID = ? AND RO.ID = ROI.RESTOCK_ORDER_ID AND ROI.ITEM_ID = I.ID
//                     AND I.SUPPLIER_ID = RO.SUPPLIER_ID AND I.SKU_ID = SI.SKU_ID`;
//         db.all(sql, [id], (err, rows) => {
//             if (err) {
//                 reject(err);
//                 return;
//             }
//             let restockOrder = {};
//             const products = [];
//             const skuItems = [];
//             let id;
//             let issueDate;
//             let state;
//             let supplierId;
//             const transportNote = {
//                 deliveryDate: null
//             };
//             for (let r in rows) {
//                 id = rows[r].ID;
//                 issueDate = rows[r].ISSUE_DATE;
//                 state = rows[r].STATE;
//                 supplierId = rows[r].SUPPLIER_ID;
//                 if (state !== 'ISSUED')
//                     transportNote.deliveryDate = rows[r].TRANSPORT_NOTE;
//                 if (products.filter(p => p.SKUId === rows[r].SKU_ID).length === 0) {
//                     products.push({
//                         SKUId: rows[r].SKU_ID,
//                         description: rows[r].DESCRIPTION,
//                         price: rows[r].PRICE,
//                         quantity: rows[r].QUANTITY
//                     });
//                 }
//                 if (state !== 'ISSUED' && state !== 'DELIVERY')
//                     skuItems.push({
//                         SKUId: rows[r].SKU_ID,
//                         rfid: rows[r].RFID
//                     });
//             }
//             if (id == undefined)
//                 resolve('404');
//             else if (state === 'ISSUED') {
//                 restockOrder =
//                 {
//                     id: id,
//                     issueDate: issueDate,
//                     state: state,
//                     products: products,
//                     supplierId: supplierId,
//                     skuItems: skuItems
//                 };
//             }
//             else {
//                 restockOrder =
//                 {
//                     id: id,
//                     issueDate: issueDate,
//                     state: state,
//                     products: products,
//                     supplierId: supplierId,
//                     transportNote: transportNote,
//                     skuItems: skuItems
//                 };
//             }
//             resolve(restockOrder);
//         });
//     });
// }

// exports.getRestockOrderById = (id) => {
//     return new Promise((resolve, reject) => {
//         // const sql = `SELECT RO.ISSUE_DATE, RO.ID, RO.STATE, RO.SUPPLIER_ID, RO.TRANSPORT_NOTE,
//         //             S.DESCRIPTION, S.PRICE, ROS.QUANTITY, S.ID SKU_ID, SI.RFID
//         //             FROM RESTOCK_ORDERS RO, RESTOCK_ORDER_SKU ROS, SKU S, SKU_ITEMS SI
//         //             WHERE RO.ID = ? AND RO.ID = ROS.RESTOCK_ORDER_ID AND ROS.SKU_ID = S.ID
//         //             AND S.ID = SI.SKU_ID`;
//         const sql = `SELECT RO.ISSUE_DATE, RO.ID, RO.STATE, RO.SUPPLIER_ID, RO.TRANSPORT_NOTE,
//                     ROS.QUANTITY, S.DESCRIPTION, S.PRICE, S.ID SKU_ID, SI.RFID
//                     FROM RESTOCK_ORDERS RO, RESTOCK_ORDER_SKU ROS, SKU S, SKU_ITEMS SI
//                     WHERE RO.ID = ? AND RO.ID = ROS.RESTOCK_ORDER_ID AND ROS.SKU_ID = S.ID AND S.ID = SI.SKU_ID`;
//         db.all(sql, [id], (err, rows) => {
//             if (err) {
//                 reject(err);
//                 return;
//             }
//             let restockOrder = {};
//             const products = [];
//             const skuItems = [];
//             let id;
//             let issueDate;
//             let state;
//             let supplierId;
//             const transportNote = {
//                 deliveryDate: null
//             };
//             for (let r in rows) {
//                 id = rows[r].ID;
//                 issueDate = rows[r].ISSUE_DATE;
//                 state = rows[r].STATE;
//                 supplierId = rows[r].SUPPLIER_ID;
//                 if (state !== 'ISSUED')
//                     transportNote.deliveryDate = rows[r].TRANSPORT_NOTE;
//                 if (products.filter(p => p.SKUId === rows[r].SKU_ID).length === 0) {
//                     products.push({
//                         SKUId: rows[r].SKU_ID,
//                         description: rows[r].DESCRIPTION,
//                         price: rows[r].PRICE,
//                         quantity: rows[r].QUANTITY
//                     });
//                 }
//                 if (state !== 'ISSUED' && state !== 'DELIVERY')
//                     skuItems.push({
//                         SKUId: rows[r].SKU_ID,
//                         rfid: rows[r].RFID
//                     });
//             }
//             if (id === undefined)
//                 resolve('404');
//             else if (state === 'ISSUED') {
//                 restockOrder =
//                 {
//                     id: id,
//                     issueDate: issueDate,
//                     state: state,
//                     products: products,
//                     supplierId: supplierId,
//                     skuItems: skuItems
//                 };
//             }
//             else {
//                 restockOrder =
//                 {
//                     id: id,
//                     issueDate: issueDate,
//                     state: state,
//                     products: products,
//                     supplierId: supplierId,
//                     transportNote: transportNote,
//                     skuItems: skuItems
//                 };
//             }
//             resolve(restockOrder);
//         });
//     });
// }

exports.getRestockOrderById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT RO.ISSUE_DATE, RO.ID, RO.STATE, RO.SUPPLIER_ID, RO.TRANSPORT_NOTE,
                    ROS.QUANTITY, ROS.DESCRIPTION, ROS.PRICE, ROS.SKU_ID, ROS.ITEM_ID, ROS.RFID
                    FROM RESTOCK_ORDERS RO, RESTOCK_ORDER_SKU ROS
                    WHERE RO.ID = ? AND RO.ID = ROS.RESTOCK_ORDER_ID`;
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
                    if (rows[r].RFID !== null) {
                        skuItems.push({
                            SKUId: rows[r].SKU_ID,
                            itemId: rows[r].ITEM_ID,
                            rfid: rows[r].RFID
                        });
                    }
            }
            if (id === undefined)
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
        db.run(sql, [restockOrder.issueDate, restockOrder.supplierId], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
}

// exports.getItemBySKUId = (SKUId, supplierId) => {
//     return new Promise((resolve, reject) => {
//         const sql = `SELECT ID FROM ITEMS WHERE SKU_ID = ? AND SUPPLIER_ID = ?`;
//         db.get(sql, [SKUId, supplierId], (err, row) => {
//             if (err) {
//                 reject(err);
//                 return;
//             }
//             if (row === undefined)
//                 resolve('404');
//             else {
//                 const itemId = row.ID;
//                 resolve(itemId);
//             }
//         });
//     });
// }

exports.getSKUById = (SKUId) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM SKU WHERE ID = ?`;
        db.get(sql, [SKUId], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row === undefined)
                resolve('404');
            else {
                resolve('');
            }
        });
    });
}

exports.createNewSKU = (product) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO SKU(ID, DESCRIPTION, PRICE) VALUES(?, ?, ?)';
        db.run(sql, [product.SKUId, product.description, product.price], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
}

// exports.createNewItem = (product, supplierId) => {
//     return new Promise((resolve, reject) => {
//         const sql = 'INSERT INTO ITEMS(DESCRIPTION, PRICE, SKU_ID, SUPPLIER_ID) VALUES(?, ?, ?, ?)';
//         db.run(sql, [product.description, product.price, product.SKUId, supplierId], function (err) {
//             if (err) {
//                 reject(err);
//                 return;
//             }
//             resolve(this.lastID);
//         });
//     });
// }

// exports.createRestockOrder_join_Product = (restockOrderId, SKUId, qty) => {
//     return new Promise((resolve, reject) => {
//         const sql = 'INSERT INTO RESTOCK_ORDER_SKU(RESTOCK_ORDER_ID, SKU_ID, QUANTITY) VALUES(?, ?, ?)'
//         db.run(sql, [restockOrderId, SKUId, qty], (err) => {
//             if (err) {
//                 reject(err);
//                 return;
//             }
//         });
//         resolve(this.lastID);
//     });
// }

exports.createRestockOrder_join_Product = (restockOrderId, product) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO RESTOCK_ORDER_SKU(RESTOCK_ORDER_ID, SKU_ID, DESCRIPTION, PRICE, ITEM_ID, QUANTITY) VALUES(?, ?, ?, ?, ?, ?)'
        db.run(sql, [restockOrderId, product.SKUId, product.description, product.price, product.itemId, product.qty], (err) => {
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

exports.createSKUItem = (RFID, SKUId) => {
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

exports.createSKUItem = (validatedId, rfid, SKUId) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO RESTOCK_ORDER_SKU(RESTOCK_ORDER_ID, SKU_ID, RFID) VALUES(?, ?, ?)';
        db.run(sql, [validatedId, rfid, SKUId], function (err) {
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
        const sql = 'DELETE FROM RESTOCK_ORDER_SKU WHERE RESTOCK_ORDER_ID = ?';
        db.run(sql, [id], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);
        });
    });

}

exports.deleteRestockOrders = () => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM RESTOCK_ORDERS';
        db.run(sql, [], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        })
    })
};