const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('get /api/positions', function () {
    it('Getting all positions', function (done) {
        agent.get('/api/positions')
            .then(function (res) {
                res.should.have.status(200);
                done();
            });
    });
});

describe('post /api/position', function () {
    it('Creating new position', function (done) {
        let newPosition = {
            "positionID":"800234543412",
            "aisleID": "8002",
            "row": "3454",
            "col": "3412",
            "maxWeight": 1000,
            "maxVolume": 1000
        }
        agent.post('/api/position')
            .send(newPosition)
            .then(function (res) {
                res.should.have.status(200);
                done();
            });
    });
});

describe('delete /api/position', function () {
    it('Deleting a position', function (done) {
        let positionID = "800234543412";
        agent.post('/api/position')
            .send(positionID)
            .then(function (res) {
                res.should.have.status(200);
                done();
            });
    });
});

describe('delete /api/position', function () {
    it('Deleting a position', function (done) {
        let positionID = "800234543412";
        agent.post('/api/position')
            .send(positionID)
            .then(function (res) {
                res.should.have.status(200);
                done();
            });
    });
});