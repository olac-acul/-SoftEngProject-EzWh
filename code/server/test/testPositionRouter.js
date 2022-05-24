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

    getAllPositions(200, {positionID: "800234543412", aisleID: "8002", row: "3454", col: "3412", maxWeight: 1000, maxVolume: 1000});
    createPosition(201, {positionID: "800234543412", aisleID: "8002", row: "3454", col: "3412", maxWeight: 1000, maxVolume: 1000});
    createPosition(422);
    modifyPosition(204, "800234543412", {aisleID: "8002", row: "3454", col: "3412", maxWeight: 1000, maxVolume: 1000}, {newAisleID: "8012", newRow: "3454", newCol: "3412", newMaxWeight: 1500, newMaxVolume: 1000, newOccupiedWeight: 200, newOccupiedVolume: 150});
    modifyPosition(422);
    changePositionID(204, "800234543412", {aisleID: "8002", row: "3454", col: "3412", maxWeight: 1000, maxVolume: 1000}, "801234543412");
    changePositionID(422);
    deletePosition(204, {positionID: "800234543412", aisleID: "8002", row: "3454", col: "3412", maxWeight: 1000, maxVolume: 1000});
    deletePosition(422);
    deleteAllPositions(204);
});

function getAllPositions(expectedHTTPStatus, position) {
    it('getting all positions data from the system', function (done) {
        agent.post('/api/position')
            .send(position)
            .then(function (res) {
                res.should.have.status(201);
                agent.get('/api/positions')
                    .then(function (res) {
                        res.should.have.status(expectedHTTPStatus);
                        res.body.positionID.should.equal(position.positionID);
                        res.body.aisleID.should.equal(position.aisleID);
                        res.body.row.should.equal(position.row);
                        res.body.col.should.equal(position.col);
                        res.body.maxWeight.should.equal(position.maxWeight);
                        res.body.maxVolume.should.equal(position.maxVolume);
                        done();
                    });
            });
    });
}

function createPosition(expectedHTTPStatus, position) {
    it('creating a position', function (done) {
        if (position !== undefined) {
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

function modifyPosition(expectedHTTPStatus, oldPositionID, position, newState) {
    it('modifying a position', function (done) {
        if (oldPositionID !== undefined) {
            agent.post('/api/position')
                .send(position)
                    .then(function (res) {
                        res.should.have.status(201);
                        const newPositionID = newAisleID + newRow + newCol;
                        agent.put('/api/position/'+ oldPositionID)
                            .send(newState)
                            .then(function (res) {
                                res.should.have.status(200);
                                agent.get('/api/positions')
                                    .then(function (res) {
                                        res.should.have.status(expectedHTTPStatus);
                                        res.body.positionID.should.equal(newState.newAisleID + newState.newRow + newState.newCol);
                                        res.body.aisleID.should.equal(newState.newAisleID);
                                        res.body.row.should.equal(newState.newRow);
                                        res.body.col.should.equal(newState.newCol);
                                        res.body.maxWeight.should.equal(newState.newMaxWeight);
                                        res.body.maxVolume.should.equal(newState.newMaxVolume);
                                        res.body.occupiedWeight.should.equal(newState.newOccupiedWeight);
                                        res.body.occupiedVolume.should.equal(newState.newOccupiedVolume);
                                    done();
                                    });
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

function changePositionID(expectedHTTPStatus, oldPositionID, position, newPositionID) {
    it('changing positionID', function (done) {
        if (oldPositionID !== undefined) {
            agent.post('/api/position')
                .send(position)
                    .then(function (res) {
                        res.should.have.status(201);
                        agent.put("/api/position/"+ oldPositionID + "/changeID")
                            .send(newPositionID)
                                .then(function (res) {
                                    res.should.have.status(200);
                                    agent.get('/api/positions')
                                        .then(function (res) {
                                            res.should.have.status(expectedHTTPStatus);
                                            res.body.positionId.positionID.should.equal(newPositionID);
                                            res.body.aisleID.should.equal(newPositionID.slice(0, 4));
                                            res.body.row.should.equal(newPositionID.slice(4, 8));
                                            res.body.col.should.equal(newPositionID.slice(8, 12));
                                            res.body.maxWeight.should.equal(position.maxWeight);
                                            res.body.maxVolume.should.equal(position.maxVolume);
                                            done();
                                        });
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


function deletePosition(expectedHTTPStatus, position) {
    it('deleting a position', function (done) {
        if (positionID !== undefined) {
            agent.post('/api/position')
                .send(position)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.delete('/api/position/'+ position.positionID)
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
