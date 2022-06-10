'use strict';
const sqlite = require('sqlite3');

const db = new sqlite.Database('EzWh', (err) => {
    if (err) throw err;
});

db.get('PRAGMA busy_timeout = 30000');

exports.dropTable = () => {
    return new Promise((resolve, reject) => {
        const sql = 'DROP TABLE IF EXISTS TEST_DESCRIPTORS';
        db.run(sql, function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);
        });
    });
}

exports.newTable = () => {
    return new Promise((resolve, reject) => {
        const sql = `CREATE TABLE IF NOT EXISTS TEST_DESCRIPTORS(ID INTEGER PRIMARY KEY AUTOINCREMENT, 
                NAME VARCHAR(50), PROCEDURE_DESCRIPTION VARCHAR(100), ID_SKU INTEGER)`;
        db.run(sql, function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
}

exports.getTestDescriptors = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM TEST_DESCRIPTORS';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const testDescriptors = rows.map((t) => (
                {
                    id: t.ID,
                    name: t.NAME,
                    procedureDescription: t.PROCEDURE_DESCRIPTION,
                    idSKU: t.ID_SKU,
                }
            ));
            resolve(testDescriptors);
        });
    });
}

exports.getTestDescriptorById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM TEST_DESCRIPTORS WHERE TEST_DESCRIPTORS.ID = ?';
        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row == undefined)
                resolve('404');
            else {
                const testDescriptor = {
                    id: row.ID,
                    name: row.NAME,
                    procedureDescription: row.PROCEDURE_DESCRIPTION,
                    idSKU: row.ID_SKU,
                };
                resolve(testDescriptor);
            }
        });
    });
}

exports.searchSKU = (id) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM SKU WHERE ID = ?`;
        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row == undefined)
                resolve(false);
            else 
                resolve(true);
        });
    });
}

exports.createTestDescriptor = (testDescriptor) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO TEST_DESCRIPTORS(NAME, PROCEDURE_DESCRIPTION, ID_SKU) VALUES(?, ?, ?)';
        db.run(sql, [testDescriptor.name, testDescriptor.procedureDescription, testDescriptor.idSKU], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
}

exports.getRFIDsBySKUId = (SKUId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT RFID FROM SKU_ITEMS WHERE SKU_ID = ?';
        db.all(sql, [SKUId], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const RFIDs = rows.map(r => r.RFID);
            resolve(RFIDs);
        });
    });
}

exports.createTestResult = (testDescriptorId) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO TEST_RESULT(ID_TEST_DESCRIPTOR) VALUES(?)';
        db.run(sql, [testDescriptorId], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
}

exports.createTestResult_join_SKUItem = (id, RFID) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO TEST_RESULT_SKUITEM(ID_TEST_RESULT, RFID) VALUES(?, ?)';
        db.run(sql, [id, RFID], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
}

exports.modifyTestDescriptor = (id, newStatus) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE TEST_DESCRIPTORS
                     SET NAME = ?, PROCEDURE_DESCRIPTION = ?, ID_SKU = ?
                     WHERE ID = ?`;
        db.run(sql, [newStatus.newName, newStatus.newProcedureDescription, newStatus.newIdSKU, id], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);
        });
    });
}

exports.deleteTestDescriptor = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM TEST_DESCRIPTORS WHERE TEST_DESCRIPTORS.ID = ?';
        db.run(sql, [id], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);
        });
    });
}


exports.deleteTestDescriptors = () => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM TEST_DESCRIPTORS';
        db.run(sql, [], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        })
    })
};