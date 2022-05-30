const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test testDescriptor APIs', () => {

    beforeEach(async () => {
        await agent.delete('/api/testDescriptors');
    })

    getAllTestDescriptors(200, 1, {name: "testDescriptor 1", procedureDescription: "PD1", idSKU: 8});
    getTestDescriptorById(200, 1, {name: "testDescriptor 1", procedureDescription: "PD1", idSKU: 8});
    getTestDescriptorById(422);
    createTestDescriptor(201, {name: "testDescriptor 1", procedureDescription: "PD1", idSKU: 8});
    createTestDescriptor(422);
    modifyTestDescriptor(204, 1, {name: "testDescriptor 1", procedureDescription: "PD1", idSKU: 8}, {newName: "testDescriptor 1", newProcedureDescription: "PD2", newIdSKU: 26});
    modifyTestDescriptor(422);
    deleteTestDescriptor(204, 1, {name: "testDescriptor 1", procedureDescription: "PD1", idSKU: 8});
    deleteTestDescriptor(422);
    deleteAllTestDescriptors(204);
});

function getAllTestDescriptors(expectedHTTPStatus, id, testDescriptor) {
    it('getting all testDescriptors data from the system', function (done) {
        agent.post('/api/testDescriptor')
            .send(testDescriptor)
            .then(function (res) {
                res.should.have.status(201);
                agent.get('/api/testDescriptors')
                    .then(function (r) {
                        r.should.have.status(expectedHTTPStatus);
                        r.body.id.should.equal(id);
                        r.body.name.should.equal(testDescriptor.name);
                        r.body.procedureDescription.should.equal(testDescriptor.procedureDescription);
                        r.body.idSKU.should.equal(testDescriptor.idSKU);
                        done();
                    });
            });
    });
}

function getTestDescriptorById(expectedHTTPStatus, id, testDescriptor) {
    it('getting testDescriptor data from the system', function (done) {
        if (id !== undefined) {
            agent.post('/api/testDescriptor')
                .send(testDescriptor)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.get('/api/testDescriptor/'+ id)
                        .then(function (r) {
                            r.should.have.status(expectedHTTPStatus);
                            r.body.id.should.equal(id);
                            r.body.name.should.equal(testDescriptor.name);
                            r.body.procedureDescription.should.equal(testDescriptor.procedureDescription);
                            r.body.idSKU.should.equal(testDescriptor.idSKU);
                            done();
                        });
                });
        }
        else {
            agent.get('/api/testDescriptor/') //we are not sending the id
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }
    });
}

function createTestDescriptor(expectedHTTPStatus, testDescriptor) {
    it('creating a testDescriptor', function (done) {
        if (testDescriptor !== undefined) {
            agent.post('/api/testDescriptor')
                .send(testDescriptor)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        } else {
            agent.post('/api/testDescriptor') //we are not sending any data
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }

    });
}

function modifyTestDescriptor(expectedHTTPStatus, id, testDescriptor, newState) {
    it('modifying a testDescriptor', function (done) {
        if (id !== undefined) {
            agent.post('/api/testDescriptor')
                .send(testDescriptor)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.put('/api/testDescriptor/'+ id)
                        .send(newState)
                        .then(function (r) {
                            r.should.have.status(expectedHTTPStatus);
                            done();
                        });
                        
                });
        }
        else {
            agent.put('/api/testDescriptor/') //we are not sending the id
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }
    });
}

function deleteTestDescriptor(expectedHTTPStatus, id, testDescriptor) {
    it('deleting a testDescriptor', function (done) {
        if (id !== undefined) {
            agent.post('/api/testDescriptor')
                .send(testDescriptor)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.delete('/api/testDescriptor/'+ id)
                        .then(function (r) {
                            r.should.have.status(expectedHTTPStatus);
                            done();
                        });
                        
                });
        }
        else {
            agent.delete('/api/testDescriptor/') //we are not sending the id
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }
    });
}

function deleteAllTestDescriptors(expectedHTTPStatus) {
    it('deleting all testDescriptors', function (done) {
        agent.delete('/api/testDescriptors')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}
