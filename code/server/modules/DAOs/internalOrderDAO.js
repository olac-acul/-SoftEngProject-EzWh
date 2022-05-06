class internalOrderDAO {
    sqlite3 = require('sqlite3');

    constructor() {
        this.db = new this.sqlite3.Database('EzWh', (err) => {
            if (err) throw err;
        });
    }

    dropTable() {
        return new Promise((resolve, reject) => {
            const sql = 'DROP TABLE IF EXIST RETURN INTERNAL_ORDERS';
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
            const sql = 'SELECT * FROM INTERNAL_ORDERS';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const internalOrders = rows.map((r) => (
                    {
                        id: r.id,
                        customerId: r.customerId,
                        state: r.state,
                        issueDate: r.issueDate
                    }
                ));
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
                        id: r.id,
                        customerId: r.customerId,
                        state: r.state,
                        issueDate: r.issueDate
                    };
                    resolve(internalOrder);
                }
            });
        })
    }

    createInternalOrder(internalOrder) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO INTERNAL_ORDERS(ID, CUSTOMER_ID, STATE, ISSUE_DATE) VALUES(?, ?, ? ,?)';
            this.db.run(sql, [internalOrder, id, internalOrder.customerId, internalOrder, state, internalOrder.issueDate], (err) => {
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
}

module.exports = internalOrderDAO;