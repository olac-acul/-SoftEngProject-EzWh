class PositionDAO {
    sqlite = require('sqlite3');

    constructor() {
        this.db = new this.sqlite.Database('EzWh', (err) => {
            if (err) throw err;
        });
    }

    dropTable() {
        return new Promise((resolve, reject) => {
            const sql = 'DROP TABLE IF EXISTS POSITIONS';
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
            const sql = `CREATE TABLE IF NOT EXISTS POSITIONS(POSITIONID VARCHAR(20) PRIMARY KEY, 
                AISLEID VARCHAR(20), ROW VARCHAR(20), COL VARCHAR(20), MAX_WEIGHT INTEGER, MAX_VOLUME INTEGER, OCCUPIED_WEIGHT INTEGER, OCCUPIED_VOLUME INTEGER)`;
            this.db.run(sql, function(err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    getPositions() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM POSITIONS';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const positions = rows.map((p) => (
                    {
                        positionID: p.POSITIONID,
                        aisleID: p.AISLEID,
                        row: p.ROW,
                        col: p.COL,
                        maxWeight: p.MAX_WEIGHT,
                        maxVolume: p.MAX_VOLUME,
                        occupiedWeight: p.OCCUPIED_WEIGHT,
                        occupiedVolume: p.OCCUPIED_VOLUME
                    }
                ));
                resolve(positions);
            });
        });
    }

    createPosition(position) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO POSITIONS(POSITIONID, AISLEID, ROW, COL, MAX_WEIGHT, MAX_VOLUME) VALUES(?, ?, ?, ?, ?, ?)';
            this.db.run(sql, [position.POSITIONID, position.AISLEID, position.ROW, position.COL, position.MAX_WEIGHT, position.MAX_VOLUME], function(err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    

    deletePosition(positionID) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM POSITIONS WHERE POSITIONS.POSITIONID = ?';
            this.db.run(sql, [positionID], function(err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.changes);
            });
        });
    }

}

module.exports = PositionDAO;