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
            const sql = `CREATE TABLE IF NOT EXISTS SUPPLIERS(USERNAME VARCHAR(50) PRIMARY KEY, EMAIL VARCHAR(50))`;
            this.db.run(sql, function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    showUserDetails() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT ID, USERNAME, NAME, SURNAME, TYPE FROM USERS';
            this.db.get(sql, [], (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                const user = {
                    id: row.ID,
                    userName: row.USERNAME,
                    name: row.NAME,
                    surename: row.SURENAME,
                    type: row.TYPE
                };
                resolve(user);
            });
        });
    }

    getSuppliers() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT U.ID, U.NAME, U.SURNAME, S.EMAIL
                         FROM USERS U, SUPPLIERS S
                         WHERE U.USERNAME = S.USERNAME`;
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const suppliers = rows.map((r) => (
                    {
                        id: r.ID,
                        name: r.NAME,
                        surename: r.SURNAME,
                        email: r.EMAIL
                    }
                ));
                resolve(suppliers);
            });
        });
    }

    getUsersExceptManager() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT U.ID, U.NAME, U.SURNAME, S.EMAIL, U.TYPE
                         FROM USERS U
                         LEFT JOIN SUPPLIERS S
                         ON U.USERNAME = S.USERNAME
                         WHERE U.TYPE != "manager"`;
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const users = rows.map((r) => {
                    if (r.EMAIL) {
                        return ({
                            id: r.ID,
                            name: r.NAME,
                            surename: r.SURNAME,
                            email: r.EMAIL,
                            type: r.TYPE
                        });
                    } else {
                        return ({
                            id: r.ID,
                            name: r.NAME,
                            surename: r.SURNAME,
                            type: r.TYPE
                        });
                    }
                });
                resolve(users);
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
            const sql = 'INSERT INTO SUPPLIERS(USERNAME, EMAIL) VALUES(?, ?)';
            this.db.run(sql, [supplier.username, supplier.email], function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    loginUser(username, password, type) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT ID, USERNAME, NAME 
                         FROM USERS
                         WHERE USERNAME = ? AND PASSWORD = ? AND TYPE = ?`;
            this.db.get(sql, [username, password, type], (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!row) resolve('Not found');
                else {
                    const user = {
                        id: row.ID,
                        userName: row.USERNAME,
                        name: row.NAME,
                    };
                    resolve(user);
                }
            });
        });
    }

    modifyUserRights(username, oldType, newType) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE USERS
                         SET TYPE = ?
                         WHERE TYPE = ? AND USERNAME = ?`;
            this.db.run(sql, [newType, oldType, username], function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.changes);
            });
        });
    }

    deleteUser(username, type) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM USERS WHERE USERNAME = ? AND TYPE = ?';
            this.db.run(sql, [username, type], function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.changes);
            });
        });
    }

    deleteSupplier(username) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM SUPPLIERS WHERE USERNAME = ?';
            this.db.run(sql, [username], function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.changes);
            });
        });
    }

}

module.exports = UserDAO;