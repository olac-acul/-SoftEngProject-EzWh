class TestResultDAO {
    sqlite = require('sqlite3');

    constructor() {
        this.db = new this.sqlite.Database('EzWh', (err) => {
            if (err) throw err;
        });
    }

    dropTable() {
        return new Promise((resolve, reject) => {
            const sql = 'DROP TABLE IF EXISTS TEST_RESULT';
            this.db.run(sql, function(err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.changes);
            });
        });
    }

    getTestResultsByRfid(rfid) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM TEST_RESULT WHERE RFID = ?';
            this.db.get(sql, [rfid], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const testResults = rows.map((r) => (
                    {
                        id: r.ID,
                        idTestDescriptor: r.ID_TEST_DESCRIPTOR,
                        date: r.DATE,
                        result: r.RESULT
                    }
                )); 
                resolve(testResults);
            });
        });
    }

    getTestResultByRfidAndId(rfid, id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM TEST_RESULT WHERE RFID = ? AND ID = ?';
            this.db.get(sql, [rfid, id], (err, row) => {
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

    createTestResult(testResult) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO TEST_RESULT(ID_TEST_DESCRIPTOR, DATE, RESULT, RFID) VALUES(?, ?, ?, ?)';
            this.db.run(sql, [testResult.idTestDescriptor, testResult.Date, testResult.Result, testResult.rfid], function(err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    modifyTestResult(rfid, id, newIdTestDescriptor, newDate, newResult){
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

    deleteTestResult(rfid, id) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM TEST_RESULT WHERE RFID = ? AND ID = ?';
            this.db.run(sql, [rfid, id], function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.changes);
            });
        });
    }

}

module.exports = TestResultDAO;