class TestDescriptorDAO {
    sqlite = require('sqlite3');

    constructor() {
        this.db = new this.sqlite.Database('EzWh', (err) => {
            if (err) throw err;
        });
    }

    dropTable() {
        return new Promise((resolve, reject) => {
            const sql = 'DROP TABLE IF EXISTS TEST_DESCRIPTORS';
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
            const sql = `CREATE TABLE IF NOT EXISTS TEST_DESCRIPTORS(ID INTEGER PRIMARY KEY AUTOINCREMENT, 
                NAME VARCHAR(50), PROCEDURE_DESCRIPTION VARCHAR(100), ID_SKU INTEGER)`;
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
            const sql = 'SELECT * FROM TEST_DESCRIPTORS';
            this.db.all(sql, [], (err, rows) => {
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

    getTestDescriptorById(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM TEST_DESCRIPTORS WHERE TEST_DESCRIPTORS.ID = ?';
            this.db.get(sql, [id], (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!row) resolve('Not Found');
                else {
                    const testDescriptor = {
                        name: row.NAME,
                        procedureDescription: row.PROCEDURE_DESCRIPTION,
                        idSKU: row.ID_SKU,
                    };
                    resolve(testDescriptor);
                }
            });
        });
    }

    createTestDescriptor(testDescriptor) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO TEST_DESCRIPTORS(NAME, PROCEDURE_DESCRIPTION, ID_SKU) VALUES(?, ?, ?)';
            this.db.run(sql, [testDescriptor.name, testDescriptor.procedureDescription, testDescriptor.idSKU], function(err) {
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
            const sql = 'DELETE FROM TEST_DESCRIPTORS WHERE TEST_DESCRIPTORS.ID = ?';
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