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

    getAllTestDescriptors(204);
    getTestDescriptorById(200, "testDescriptor 1", "PD1", 8);
    createTestDescriptor(201, "testDescriptor 1", "PD1", 8);
    createTestDescriptor(422);
});

function getAllTestDescriptors(expectedHTTPStatus) {
    it('Getting all testDescriptors', function (done) {
        agent.get('/api/testDescriptors')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
};

function getTestDescriptorById(expectedHTTPStatus, name, procedureDescription, idSKU) {
    it('getting testDescriptor data from the system', function (done) {
        let testDescriptor = { name: name, procedureDescription:procedureDescription, idSKU:idSKU }
        agent.post('/api/testDescriptor')
            .send(testDescriptor)
            .then(function (res) {
                res.should.have.status(201);
                res.body.id.should.equal(id);
                agent.get('/api/testDescriptor' + 1)
                    .then(function (r) {
                        r.should.have.status(expectedHTTPStatus);
                        r.body.id.should.equal(1);
                        r.body.name.should.equal(name + ' ' + surname);
                        r.body.procedureDescription.should.equal(procedureDescription);
                        r.body.idSKU.should.equal(idSKU);
                        done();
                    });
            });
    });
}

function createTestDescriptor(expectedHTTPStatus, name, procedureDescription, idSKU) {
    it('adding a new testDescriptor', function (done) {
            let testDescriptor = { name: name, procedureDescription: procedureDescription, idSKU: idSKU}
            agent.post('/api/testDescriptor')
                .send(testDescriptor)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
            agent.post('/api/testDescriptor') //we are not sending any data
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });

    });
}
