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
            const sql = `SELECT IO.ISSUE_DATE ISSUE_DATE, IO.ID ID, IO.STATE STATE, IO.CUSTOMER_ID CUSTOMER_ID PR.DESCRIPTION DESCRIPTION, PR.PRICE AS PRICE, PR.SKU_ID SKU_ID
                FROM INTERNAL_ORDERS IO, 
                (SELECT I.SKU_ID SKU_ID, I.DESCRIPTION DESCRIPTION, I.PRICE PRICE, I.CUSTOMER_ID CUSTOMER_ID
                FROM ITEMS I, INTERNAL_ORDER_ITEMS S
                WHERE I.SKU_ID = S.ITEM_ID) PR`;
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                let id;
                let issueDate;
                let state;
                let customerId;
                let products = rows.map(r => {
                    id = r.ID;
                    issueDate = r.ISSUE_DATE;
                    state = r.STATE;
                    customerId = r.CUSTOMER_ID;
                    return (
                        {
                            SKUId: r.SKU_ID,
                            description: r.DESCRIPTION,
                            price: r.PRICE
                        });
                });
                const internalOrders =
                {
                    id: id,
                    issueDate: issueDate,
                    state: state,
                    products: products,
                    customerId: customerId
                }
                resolve(internalOrders);
            });
        });
    }

    getInternalOrderById(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM INTERNAL_ORDERS WHERE INTERNAL_ORDERS.ID = ?';
            this.db.get(sql, [id], (err) => {
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