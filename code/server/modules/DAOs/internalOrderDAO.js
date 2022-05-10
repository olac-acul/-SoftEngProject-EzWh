class internalOrderDAO {
    sqlite3 = require('sqlite3');

    constructor() {
        this.db = new this.sqlite3.Database('EzWh', (err) => {
            if (err) throw err;
        });
    }

    dropTable() {
        return new Promise((resolve, reject) => {
            const sql = 'DROP TABLE IF EXIST INTERNAL_ORDERS';
            this.db.run(sql, function (err) {
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
            const sql = `CREATE TABLE IF NOT EXISTS INTERNAL_ORDERS(ID INTEGER PRIMARY KEY AUTOINCREMENT, CUSTOMER_ID INTEGER, STATE TEXT, ISSUE_DATE DATETIME)`;
            this.db.run(sql, function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    getInternalOrder() {
        return new Promise((resolve, reject) => {
            // duoble join, 3 tables to get the list of SKU
            const sql = `SELECT IO.ISSUE_DATE ISSUE_DATE, IO.ID ID, IO.STATE STATE, IO.CUSTOMER_ID CUSTOMER_ID, PR.DESCRIPTION DESCRIPTION, PR.PRICE PRICE, PR.SKU_ID SKU_ID
            FROM INTERNAL_ORDERS AS IO, 
            (SELECT I.SKU_ID SKU_ID, I.DESCRIPTION DESCRIPTION, I.PRICE PRICE, S.INTERNAL_ORDER_ID INTERNAL_ORDER_ID
            FROM ITEMS I, INTERNAL_ORDER_PRODUCTS S
            WHERE I.SKU_ID = S.SKU_ID) AS PR
            WHERE IO.ID = PR.INTERNAL_ORDER_ID`;
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const internalOrders = [];
                let products = [];
                let id;
                let issueDate;
                let state;
                let customerId;
                for (r in rows) {
                    if (id === 0) {
                        id = r.ID;
                        issueDate = r.ISSUE_DATE;
                        customerId = r.CUSTOMER_ID;
                        state = r.STATE;
                        products.push({
                            SKUId: r.SKU_ID,
                            description: r.DESCRIPTION,
                            price: r.PRICE
                        });
                    }
                    else if (id === r.ID) {
                        products.push({
                            SKUId: r.SKU_ID,
                            description: r.DESCRIPTION,
                            price: r.PRICE
                        });
                    }
                    else if (id !== r.ID) {
                        internalOrders.push({
                            id: id,
                            issueDate: issueDate,
                            state: state,
                            products: products,
                            customerId: customerId
                        });
                        products = [];
                        id = r.ID;
                        issueDate = r.ISSUE_DATE;
                        customerId = r.CUSTOMER_ID;
                        state = r.STATE;
                        products.push({
                            SKUId: r.SKU_ID,
                            description: r.DESCRIPTION,
                            price: r.PRICE
                        });
                    }
                    internalOrders.push({
                        id: id,
                        issueDate: issueDate,
                        state: state,
                        products: products,
                        customerId: customerId
                    });

                }
                // let id;
                // let issueDate;
                // let state;
                // let customerId;
                // let products = rows.map(r => {
                //     id = r.ID;
                //     issueDate = r.ISSUE_DATE;
                //     state = r.STATE;
                //     customerId = r.CUSTOMER_ID;
                //     return (
                //         {
                //             SKUId: r.SKU_ID,
                //             description: r.DESCRIPTION,
                //             price: r.PRICE
                //         });
                // });

                resolve(internalOrders);
            });
        });
    }

    getInternalOrderById(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM INTERNAL_ORDERS WHERE INTERNAL_ORDERS.ID = ?';
            this.db.get(sql, [id], (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!row) resolve('not found');
                else {
                    const internalOrder = {
                        id: r.ID,
                        customerId: r.CUSTOMER_ID,
                        state: r.STATE,
                        issueDate: r.ISSUE_DATE
                    };
                    resolve(internalOrder);
                }
            });
        })
    }

    createInternalOrder(internalOrder) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO INTERNAL_ORDERS(ID, CUSTOMER_ID, STATE, ISSUE_DATE) VALUES(?, ?, ? ,?)';
            this.db.run(sql, [internalOrder.id, internalOrder.customerId, internalOrder.state, internalOrder.issueDate], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID)
            });
        });
    }

    deleteInternalOrder(id) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM INTERNAL_ORDERS WHERE INTERNAL_ORDERS.ID = ?';
            this.db.run(sql, [id], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.changes);
            });
        });
    }

    changeStateInternalOrder(id, newState) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE INTERNAL_ORDERS SET INTERNAL_ORDERS.STATE = ? WHERE INTERNAL_ORDERS.ID = ?'
            this.db.run(sql, [newState, id], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.changes);

            });
        });
    }

    addSkuToInternalOrder(id, skuList) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO INT_ORD_SKU(ORD_ID, RFID) VALUES(?, ?)';
            skuList.forEach(sku => {
                this.db.run(sql, [id, sku.rfid], (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(this.lastID);
                });
            });
        });
    }
}

module.exports = internalOrderDAO;