const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test position APIs', () => {

    beforeEach(async () => {
        await agent.delete('/api/positions');
    })

    getAllPositions(204);
    createPosition(201, "800234543412", "8002", "3454", "3412", 1000, 1000);
    createPosition(422);
    modifyPosition(200, "800234543412", "8012", "3454", "3412", 1000, 1000, 300, 150);
    modifyPosition(422);
    changePositionID(200, "800234543412", "801234543412");
    changePositionID(422);
    deletePosition(200, "800234543412", "8002", "3454", "3412", 1000, 1000);
    deletePosition(422);
    deleteAllPositions(204);
});

function getAllPositions(expectedHTTPStatus, positionID, aisleID, row, col, maxWeight, maxVolume) {
    it('getting all positions data from the system', function (done) {
        let position = { positionID: positionID, aisleID: aisleID, row: row, col: col, maxWeight: maxWeight, maxVolume: maxVolume }
        agent.post('/api/position')
            .send(position)
            .then(function (res) {
                res.should.have.status(201);
                agent.get('/api/positions')
                    .then(function (res) {
                        res.should.have.status(expectedHTTPStatus);
                        res.body.positionID.should.equal(positionID);
                        res.body.aisleID.should.equal(aisleID);
                        res.body.row.should.equal(row);
                        res.body.col.should.equal(col);
                        res.body.maxWeight.should.equal(maxWeight);
                        res.body.maxVolume.should.equal(maxVolume);
                        done();
                    });
            });
    });
}

function createPosition(expectedHTTPStatus, positionID, aisleID, row, col, maxWeight, maxVolume) {
    it('creating a position', function (done) {
        if (positionID !== undefined) {
            let position = { positionID: positionID, aisleID: aisleID, row: row, col: col, maxWeight: maxWeight, maxVolume: maxVolume }
            agent.post('/api/position')
                .send(position)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        } else {
            agent.post('/api/position') //we are not sending any data
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }

    });
}

function modifyPosition(expectedHTTPStatus, oldPositionID, position) {
    it('modifying a position', function (done) {
        if (oldPositionID !== undefined) {
            const newPositionID = position.newAisleID + position.newRow + position.newCol;
            let updatedPosition = { positionID: newPositionID, aisleID: position.newAisleID, row: position.newRow, col: position.newCol, maxWeight: position.newMaxWeight, maxVolume: position.newMaxVolume, occupiedWeight: position.newOccupiedWeight, occupiedVolume: position.newOccupiedVolume }
            agent.put('/api/position/'+ oldPositionID)
                .send(updatedPosition)
                .then(function (res) {
                    res.should.have.status(200);
                    agent.get('/api/position/'+ newPositionID)
                        .then(function (res) {
                            res.should.have.status(expectedHTTPStatus);
                            res.body.positionID.should.equal(newPositionID);
                            res.body.aisleID.should.equal(position.newAisleID);
                            res.body.row.should.equal(position.newRow);
                            res.body.col.should.equal(position.newCol);
                            res.body.maxWeight.should.equal(position.newMaxWeight);
                            res.body.maxVolume.should.equal(position.newMaxVolume);
                            res.body.occupiedVolume.should.equal(position.newOccupiedVolume);
                            res.body.occupiedVolume.should.equal(position.newOccupiedVolume);
                        done();
                        });
                        
                });
        }
        else {
            agent.put('/api/position/') //we are not sending any data
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }
    });
}

function changePositionID(expectedHTTPStatus, oldPositionID, newPositionId) {
    it('changing positionID', function (done) {
        if (oldPositionID !== undefined) {
            const newPositionID = newPositionId.newPositionID;
            const newAisleID = newPositionID.slice(0, 4);
            const newRow = newPositionID.slice(4, 8);
            const newCol = newPositionID.slice(8, 12);
            let updatedElements = { positionID: newPositionID, aisleID: newAisleID, row: newRow, col: newCol }
            agent.put("/api/position/"+ oldPositionID + "/changeID")
                .send(updatedElements)
                .then(function (res) {
                    res.should.have.status(200);
                    agent.get('/api/position/'+ newPositionID)
                        .then(function (res) {
                            res.should.have.status(expectedHTTPStatus);
                            res.body.positionID.should.equal(newPositionID);
                            res.body.aisleID.should.equal(newAisleID);
                            res.body.row.should.equal(newRow);
                            res.body.col.should.equal(newCol);
                        done();
                        });
                        
                });
        }
        else {
            agent.put('/api/position/changeID') //we are not sending any data
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }
    });
}


function deletePosition(expectedHTTPStatus, positionID, aisleID, row, col, maxWeight, maxVolume) {
    it('deleting a position', function (done) {
        if (positionID !== undefined) {
            let position = { positionID: positionID, aisleID: aisleID, row: row, col: col, maxWeight: maxWeight, maxVolume: maxVolume }
            agent.post('/api/position')
                .send(position)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.delete('/api/position/'+ id)
                        .then(function (r) {
                            r.should.have.status(expectedHTTPStatus);
                            done();
                        });
                        
                });
        }
        else {
            agent.delete('/api/position/') //we are not sending the positionID
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }
    });
}

function deleteAllPositions(expectedHTTPStatus) {
    it('deleting all positions', function (done) {
        agent.delete('/api/positions')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}
