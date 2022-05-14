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
