'use strict';
const sqlite = require('sqlite3');

const db = new sqlite.Database('EzWh', (err) => {
    if (err) throw err;
});

db.get('PRAGMA busy_timeout = 30000');

exports.dropTable = () => {
    return new Promise((resolve, reject) => {
        const sql = 'DROP TABLE IF EXISTS TEST_RESULT';
        db.run(sql, function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);
        });
    });
}

exports.newTestResultTable = () => {
    return new Promise((resolve, reject) => {
        const sql = `CREATE TABLE IF NOT EXISTS TEST_RESULT(
                ID INTEGER PRIMARY KEY AUTOINCREMENT,
                ID_TEST_DESCRIPTOR	INTEGER NOT NULL,
                DATE DATE NOT NULL,
                RESULT BOOL NOT NULL)`;
        db.run(sql, function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
}

exports.newTestResult_join_SKUItemTable = () => {
    return new Promise((resolve, reject) => {
        const sql = `CREATE TABLE IF NOT EXISTS TEST_RESULT_SKUITEM(
                ID_TEST_RESULT INTEGER PRIMARY KEY,
                RFID VARCHAR(32) PRIMARY KEY)`;
        db.run(sql, function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
}

exports.getTestResultsByRfid = (RFID) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT TR.ID, TR.ID_TEST_DESCRIPTOR, TR.DATE, TR.RESULT
                    FROM TEST_RESULT TR, TEST_RESULT_SKUITEM TRS, SKU_ITEMS S
                    WHERE TR.ID = TRS.ID_TEST_RESULT AND TRS.RFID = ? AND TRS.RFID = S.RFID`;
        db.all(sql, [RFID], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            if (rows.length === 0)
                resolve([]);
            else {
                const testResults = rows.map(r => (
                    {
                        id: r.ID,
                        idTestDescriptor: r.ID_TEST_DESCRIPTOR,
                        date: r.DATE,
                        result: r.RESULT
                    }
                ));
                resolve(testResults);
            }
        });
    });
}

exports.getTestResultByRfidAndId = (rfid, id) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT TR.ID, TR.ID_TEST_DESCRIPTOR, TR.DATE, TR.RESULT
                    FROM TEST_RESULT TR, TEST_RESULT_SKUITEM TRS, SKU_ITEMS S
                    WHERE TR.ID = ? AND TR.ID = TRS.ID_TEST_RESULT AND TRS.RFID = ? AND TRS.RFID = S.RFID`;
        db.get(sql, [id, rfid], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row == undefined)
                resolve('404');
            else {
                const testResult = {
                    id: row.ID,
                    idTestDescriptor: row.ID_TEST_DESCRIPTOR,
                    date: row.DATE,
                    result: row.RESULT
                };
                resolve(testResult);
            }
        });
    });
}

exports.createTestResult = (testResult) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO TEST_RESULT(ID_TEST_DESCRIPTOR, DATE, RESULT) VALUES(?, ?, ?)';
        db.run(sql, [testResult.idTestDescriptor, testResult.Date, testResult.Result], function (err) {
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

exports.modifyTestResult = (id, newState) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE TEST_RESULT
                             SET ID_TEST_DESCRIPTOR = ?, DATE = ?, RESULT = ?
                             WHERE ID = ?`;
        db.run(sql, [newState.newIdTestDescriptor, newState.newDate, newState.newResult, id], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);
        });
    });
}

exports.deleteTestResult = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM TEST_RESULT WHERE ID = ?';
        db.run(sql, [id], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);
        });
    });
}

exports.deleteTestResult_join_SKUItem = (RFID, id) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM TEST_RESULT_SKUITEM WHERE RFID = ? AND ID_TEST_RESULT = ?';
        db.run(sql, [RFID, id], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);
        });
    });
}

exports.deleteTestResults = () => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM TEST_RESULT';
        db.run(sql, [], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        });
    });
}