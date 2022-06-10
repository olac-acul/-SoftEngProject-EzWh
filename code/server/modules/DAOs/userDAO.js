'use strict';
const sqlite = require('sqlite3');

const db = new sqlite.Database('EzWh', (err) => {
    if (err) throw err;
});

db.get('PRAGMA busy_timeout = 30000');

exports.dropTable = () => {
    return new Promise((resolve, reject) => {
        const sql = 'DROP TABLE IF EXISTS USERS';
        db.run(sql, function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);
        });
    });
}

exports.newUserTable = () => {
    return new Promise((resolve, reject) => {
        const sql = `CREATE TABLE IF NOT EXISTS USERS(ID INTEGER PRIMARY KEY AUTOINCREMENT, 
                EMAIL VARCHAR(50), NAME VARCHAR(50), SURNAME VARCHAR(50), PASSWORD VARCHAR(50), TYPE VARCHAR(20))`;
        db.run(sql, function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
}

exports.showUserDetails = (email) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT ID, EMAIL, NAME, SURNAME, TYPE FROM USERS WHERE EMAIL = ?';
        db.get(sql, [email], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row == undefined)
                resolve('404');
            else{
                const user = {
                    id: row.ID,
                    email: row.EMAIL,
                    name: row.NAME,
                    surename: row.SURENAME,
                    type: row.TYPE
                };
                resolve(user);
            }
            
        });
    });
}

exports.getSuppliers = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT U.ID, U.NAME, U.SURNAME, U.EMAIL
                         FROM USERS U
                         WHERE U.TYPE = "supplier"`;
        db.all(sql, [], (err, rows) => {
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

exports.getUsers = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT U.ID, U.NAME, U.SURNAME, U.EMAIL, U.TYPE
                         FROM USERS U`;
        db.all(sql, [], (err, rows) => {
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

exports.getUsersExceptManager = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT U.ID, U.NAME, U.SURNAME, U.EMAIL, U.TYPE
                         FROM USERS U
                         WHERE U.TYPE != "manager"`;
        db.all(sql, [], (err, rows) => {
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

exports.addUser = (user) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO USERS(EMAIL, NAME, SURNAME, PASSWORD, TYPE) VALUES(?, ?, ?, ?, ?)';
        db.run(sql, [user.username, user.name, user.surname, user.password, user.type], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
}

exports.loginUser = (email, password, type) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT ID, EMAIL, NAME 
                         FROM USERS
                         WHERE EMAIL = ? AND PASSWORD = ? AND TYPE = ?`;
        db.get(sql, [email, password, type], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row == undefined)
                resolve('Not found');
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

exports.modifyUserRights = (email, oldType, newType) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE USERS
                         SET TYPE = ?
                         WHERE TYPE = ? AND EMAIL = ?`;
        db.run(sql, [newType, oldType, email], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);
        });
    });
}

exports.deleteUser = (email, type) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM USERS WHERE EMAIL = ? AND TYPE = ?';
        db.run(sql, [email, type], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);
        });
    });
}

exports.deleteUsers = () => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM USERS';
        db.run(sql, [], function(err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        });
    });
};