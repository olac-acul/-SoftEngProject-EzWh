class TestDescriptorDAO {
    sqlite = require('sqlite3');

    constructor() {
        this.db = new this.sqlite.Database('EzWh', (err) => {
            if (err) throw err;
        });
    }

    dropTable() {
        return new Promise((resolve, reject) => {
            const sql = 'DROP TABLE IF EXISTS TESTDESCRIPTORS';
            this.db.run(sql, function(err) {
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
            const sql = `CREATE TABLE IF NOT EXISTS TESTDESCRIPTORS(ID INTEGER PRIMARY KEY AUTOINCREMENT, 
                NAME VARCHAR(50), PROCEDUREDESCRIPTION VARCHAR(100), IDSKU INTEGER)`;
            this.db.run(sql, function(err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    getTestDescriptors() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM TESTDESCRIPTORS';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const testDescriptors = rows.map((t) => (
                    {
                        id: t.ID,
                        name: t.NAME,
                        procedureDescription: t.PROCEDUREDESCRIPTION,
                        idSKU: t.IDSKU,
                    }
                ));
                resolve(testDescriptors);
            });
        });
    }

    getTestDescriptorById(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM TESTDESCRIPTORS WHERE TESTDESCRIPTORS.ID = ?';
            this.db.get(sql, [id], (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!row) resolve('Not Found');
                else {
                    const testDescriptor = {
                        name: row.NAME,
                        procedureDescription: row.PROCEDUREDESCRIPTION,
                        idSKU: row.IDSKU,
                    };
                    resolve(testDescriptor);
                }
            });
        });
    }

    createTestDescriptor(testDescriptor) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO TESTDESCRIPTORS(NAME, PROCEDUREDESCRIPTION, IDSKU) VALUES(?, ?, ?)';
            this.db.run(sql, [testDescriptor.NAME, testDescriptor.PROCEDUREDESCRIPTION, testDescriptor.IDSKU], function(err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    

    deleteTestDescriptor(id) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM TESTDESCRIPTORS WHERE TESTDESCRIPTORS.ID = ?';
            this.db.run(sql, [id], function(err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.changes);
            });
        });
    }

}

module.exports = TestDescriptorDAO;