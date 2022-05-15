'use strict';
const sqlite = require('sqlite3');

const db = new sqlite.Database('EzWh', (err) => {
    if (err) throw err;
});

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


deleteTestDescriptors = () => {
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