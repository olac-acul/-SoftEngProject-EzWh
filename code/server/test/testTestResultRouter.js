const chai = require('chai');
const chaiHttp = require('chai-http');
const { test } = require('mocha');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

const rfid = '123123123';

describe('test testResult APIs', () => {

    beforeEach(async () => {
        await agent.delete('/api/skuitems/testResults');
    })
    getAllTestResultsByRfid(200, 1, {idTestDescriptor:14, Date:"2021/11/29", Result: false});
    getTestResultByRfidAndId(200, 1, {idTestDescriptor:14, Date:"2021/11/29", Result: false});
    getTestResultByRfidAndId(422);
    createTestResult(201, {idTestDescriptor:14, Date:"2021/11/29", Result: false});
    createTestResult(422);
    modifyTestResult(204, 1, {idTestDescriptor:14, Date:"2021/11/29", Result: false}, {newIdTestDescriptor:12, newDate:"2021/11/29", newResult: true});
    modifyTestResult(422);
    deleteTestResult(204, 1, {idTestDescriptor:14, Date:"2021/11/29", Result: false});
    deleteTestResult(422);
});

function getAllTestResultsByRfid(expectedHTTPStatus, id, testResult) {
    it('getting all testResults data from the system by rfid', function (done) {
        agent.post('/api/skuitems/' + rfid + '/testResult')
            .send(testResult)
            .then(function (res) {
                res.should.have.status(201);
                agent.get('/api/skuitems/' + rfid + '/testResults')
                    .then(function (r) {
                        r.should.have.status(expectedHTTPStatus);
                        r.body.id.should.equal(id);
                        r.body.idTestDescriptor.should.equal(testResult.idTestDescriptor);
                        r.body.Date.should.equal(testResult.Date);
                        r.body.Result.should.equal(testResult.Result);
                        done();
                    });
            });
    });
}

function getTestResultByRfidAndId(expectedHTTPStatus, id, testResult) {
    it('getting testResult data from the system by rfid and id', function (done) {
        if (id !== undefined) {
            agent.post('/api/skuitems/' + rfid + '/testResult')
                .send(testResult)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.get('/api/skuitems/' + rfid + '/testResult/'+ id)
                        .then(function (r) {
                            r.should.have.status(expectedHTTPStatus);
                            r.body.id.should.equal(id);
                            r.body.idTestDescriptor.should.equal(testResult.idTestDescriptor);
                            r.body.Date.should.equal(testResult.Date);
                            r.body.Result.should.equal(testResult.Result);
                            done();
                        });
                });
        }
        else {
            agent.get('/api/skuitems/' + rfid + '/testResult/') //we are not sending the id
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }
    });
}

function createTestResult(expectedHTTPStatus, testResult) {
    it('creating a testResult', function (done) {
        if (testResult !== undefined) {
            agent.post('/api/skuitems/' + rfid + '/testResult')
                .send(testResult)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        } else {
            agent.post('/api/skuitems/' + rfid + '/testResult') //we are not sending any data
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }

    });
}

function modifyTestResult(expectedHTTPStatus, id, testResult, newState) {
    it('modifying a testResult', function (done) {
        if (id !== undefined) {
            agent.post('/api/skuitems/' + rfid + '/testResult')
                .send(testResult)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.put('/api/skuitems/' + rfid + '/testResult/'+ id)
                        .send(newState)
                        .then(function (r) {
                            r.should.have.status(expectedHTTPStatus);
                            done();
                        });
                        
                });
        }
        else {
            agent.put('/api/skuitems/' + rfid + '/testResult') //we are not sending the id
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }
    });
}

function deleteTestResult(expectedHTTPStatus, id, testResult) {
    it('deleting a testResult', function (done) {
        if (id !== undefined) {
            agent.post('/api/skuitems/' + rfid + '/testResult')
                .send(testResult)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.delete('/api/skuitems/' + rfid + '/testResult/'+ id)
                        .then(function (r) {
                            r.should.have.status(expectedHTTPStatus);
                            done();
                        });
                        
                });
        }
        else {
            agent.delete('/api/skuitems/' + rfid + '/testResult') //we are not sending the id
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }
    });
}