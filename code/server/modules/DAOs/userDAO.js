class UserDAO {
    sqlite = require('sqlite3');

    constructor() {
        this.db = new this.sqlite.Database('EzWh', (err) => {
            if (err) throw err;
        });
    }

    dropTable() {
        return new Promise((resolve, reject) => {
            const sql = 'DROP TABLE IF EXISTS USERS';
            this.db.run(sql, function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.changes);
            });
        });
    }

    newUserTable() {
        return new Promise((resolve, reject) => {
            const sql = `CREATE TABLE IF NOT EXISTS USERS(ID INTEGER PRIMARY KEY AUTOINCREMENT, 
                USERNAME VARCHAR(50), NAME VARCHAR(50), SURNAME VARCHAR(50), PASSWORD VARCHAR(50), TYPE VARCHAR(20))`;
            this.db.run(sql, function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    newSupplierTable() {
        return new Promise((resolve, reject) => {
            const sql = `CREATE TABLE IF NOT EXISTS SUPPLIERS(ID INTEGER PRIMARY KEY, EMAIL VARCHAR(50))`;
            this.db.run(sql, function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }




    addUser(user) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO USERS(USERNAME, NAME, SURNAME, PASSWORD, TYPE) VALUES(?, ?, ?, ?, ?)';
            this.db.run(sql, [user.username, user.name, user.surname, user.password, user.type], function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    addSupplier(supplier) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO SUPPLIERS(ID, EMAIL) VALUES(?, ?)';
            this.db.run(sql, [supplier.id, supplier.email], function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

}

module.exports = UserDAO;