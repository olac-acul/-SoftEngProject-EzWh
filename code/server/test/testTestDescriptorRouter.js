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

    getAllTestDescriptors(204, 1, "testDescriptor 1", "PD1", 8);
    getTestDescriptorById(200, 1, "testDescriptor 1", "PD1", 8);
    getTestDescriptorById(422);
    createTestDescriptor(201, "testDescriptor 1", "PD1", 8);
    createTestDescriptor(422);
    modifyTestDescriptor(200, 1, "testDescriptor 1", "PD1", 8, "testDescriptor 1", "PD2", 26);
    modifyTestDescriptor(422);
    deleteTestDescriptor(200, 1, "testDescriptor 1", "PD1", 8);
    deleteTestDescriptor(422);
    deleteAllTestDescriptors(204);
});

function getAllTestDescriptors(expectedHTTPStatus, id, name, procedureDescription, idSKU) {
    it('getting all testDescriptors data from the system', function (done) {
        let testDescriptor = { name: name, procedureDescription:procedureDescription, idSKU:idSKU }
        agent.post('/api/testDescriptor')
            .send(testDescriptor)
            .then(function (res) {
                res.should.have.status(201);
                agent.get('/api/testDescriptors')
                    .then(function (r) {
                        r.should.have.status(expectedHTTPStatus);
                        r.body.id.should.equal(id);
                        r.body.name.should.equal(name);
                        r.body.procedureDescription.should.equal(procedureDescription);
                        r.body.idSKU.should.equal(idSKU);
                        done();
                    });
            });
    });
}

function getTestDescriptorById(expectedHTTPStatus, id, name, procedureDescription, idSKU) {
    it('getting testDescriptor data from the system', function (done) {
        if (id !== undefined) {
            let testDescriptor = { name: name, procedureDescription:procedureDescription, idSKU:idSKU }
            agent.post('/api/testDescriptor')
                .send(testDescriptor)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.get('/api/testDescriptor/'+ id)
                        .then(function (r) {
                            r.should.have.status(expectedHTTPStatus);
                            r.body.id.should.equal(id);
                            r.body.name.should.equal(name);
                            r.body.procedureDescription.should.equal(procedureDescription);
                            r.body.idSKU.should.equal(idSKU);
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

function createTestDescriptor(expectedHTTPStatus, name, procedureDescription, idSKU) {
    it('creating a testDescriptor', function (done) {
        if (name !== undefined) {
            let testDescriptor = { name: name, procedureDescription: procedureDescription, idSKU: idSKU }
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

function modifyTestDescriptor(expectedHTTPStatus, id, name, procedureDescription, idSKU, newName, newProcedureDescription, newIdSKU) {
    it('modifying a testDescriptor', function (done) {
        if (id !== undefined) {
            let testDescriptor = { name: name, procedureDescription: procedureDescription, idSKU: idSKU }
            agent.post('/api/testDescriptor')
                .send(testDescriptor)
                .then(function (res) {
                    res.should.have.status(201);
                    let newStatus = { newName: newName, newProcedureDescription:newProcedureDescription, newIdSKU:newIdSKU }
                    agent.put('/api/testDescriptor/'+ id)
                        .send(newStatus)
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

function deleteTestDescriptor(expectedHTTPStatus, id, name, procedureDescription, idSKU) {
    it('deleting a testDescriptor', function (done) {
        if (id !== undefined) {
            let testDescriptor = { name: name, procedureDescription:procedureDescription, idSKU:idSKU }
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
