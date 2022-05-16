'use strict';
const sqlite = require('sqlite3');

const db = new sqlite.Database('EzWh', (err) => {
    if (err) throw err;
});

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

exports.getTestResultsByRfid = (rfid) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM TEST_RESULT WHERE RFID = ?';
        db.get(sql, [rfid], (err, r) => {
            if (err) {
                reject(err);
                return;
            }
            const testResults =
            {
                id: r.ID,
                idTestDescriptor: r.ID_TEST_DESCRIPTOR,
                date: r.DATE,
                result: r.RESULT
            };
            resolve(testResults);
        });
    });
}

exports.getTestResultByRfidAndId = (rfid, id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM TEST_RESULT WHERE RFID = ? AND ID = ?';
        db.get(sql, [rfid, id], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            const testResult = {
                id: row.ID,
                idTestDescriptor: row.ID_TEST_DESCRIPTOR,
                date: row.DATE,
                result: row.RESULT
            };
            resolve(testResult);
        });
    });
}

exports.createTestResult = (testResult) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO TEST_RESULT(ID_TEST_DESCRIPTOR, DATE, RESULT, RFID) VALUES(?, ?, ?, ?)';
        db.run(sql, [testResult.idTestDescriptor, testResult.Date, testResult.Result, testResult.rfid], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
}

exports.modifyTestResult = (rfid, id, newIdTestDescriptor, newDate, newResult) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE TEST_RESULT
                             SET ID_TEST_DESCRIPTOR = ?, DATE = ?, RESULT = ?
                             WHERE RFID = ? AND ID = ?`;
        db.run(sql, [newIdTestDescriptor, newDate, newResult, rfid, id], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);
        });
    });
}

exports.deleteTestResult = (rfid, id) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM TEST_RESULT WHERE RFID = ? AND ID = ?';
        db.run(sql, [rfid, id], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);
        });
    });
}