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
                EMAIL VARCHAR(50), NAME VARCHAR(50), SURNAME VARCHAR(50), PASSWORD VARCHAR(50), TYPE VARCHAR(20))`;
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
            const sql = 'SELECT ID, EMAIL, NAME, SURNAME, TYPE FROM USERS';
            this.db.get(sql, [], (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                const user = {
                    id: row.ID,
                    email: row.EMAIL,
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
            const sql = `SELECT U.ID, U.NAME, U.SURNAME, U.EMAIL
                         FROM USERS U
                         WHERE U.TYPE = "supplier"`;
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
            const sql = `SELECT U.ID, U.NAME, U.SURNAME, U.EMAIL, U.TYPE
                         FROM USERS U
                         WHERE U.TYPE != "manager"`;
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const users = rows.map((r) => {
                        return ({
                            id: r.ID,
                            name: r.NAME,
                            surename: r.SURNAME,
                            email: r.EMAIL,
                            type: r.TYPE
                        });
                });
                resolve(users);
            });
        });
    }

    addUser(user) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO USERS(EMAIL, NAME, SURNAME, PASSWORD, TYPE) VALUES(?, ?, ?, ?, ?)';
            this.db.run(sql, [user.username, user.name, user.surname, user.password, user.type], function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    loginUser(email, password, type) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT ID, EMAIL, NAME 
                         FROM USERS
                         WHERE EMAIL = ? AND PASSWORD = ? AND TYPE = ?`;
            this.db.get(sql, [email, password, type], (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!row) resolve('Not found');
                else {
                    const user = {
                        id: row.ID,
                        email: row.EMAIL,
                        name: row.NAME,
                    };
                    resolve(user);
                }
            });
        });
    }

    modifyUserRights(email, oldType, newType) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE USERS
                         SET TYPE = ?
                         WHERE TYPE = ? AND EMAIL = ?`;
            this.db.run(sql, [newType, oldType, email], function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.changes);
            });
        });
    }

    deleteUser(email, type) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM USERS WHERE EMAIL = ? AND TYPE = ?';
            this.db.run(sql, [email, type], function (err) {
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