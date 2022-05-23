const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test internalOrder APIs', () => {

    beforeEach(async () => {
        await agent.delete('/api/internalOrders');
    })

    getAllInternalOrders(204, 1, ["2021/11/29 09:33", [{"SKUId":12,"description":"a product","price":10.99,"qty":3},
    {"SKUId":180,"description":"another product","price":11.99,"qty":3}], 1]);
    getInternalOrderById(200, 1, ["2021/11/29 09:33", [{"SKUId":12,"description":"a product","price":10.99,"qty":3},
    {"SKUId":180,"description":"another product","price":11.99,"qty":3}], 1]);
    getInternalOrderById(422);
    createInternalOrder(201, ["2021/11/29 09:33", [{"SKUId":12,"description":"a product","price":10.99,"qty":3},
    {"SKUId":180,"description":"another product","price":11.99,"qty":3}], 1]);
    createInternalOrder(422);
    changeInternalOrderState(200, 1, ["2021/11/29 09:33", [{"SKUId":12,"description":"a product","price":10.99,"qty":3},
    {"SKUId":180,"description":"another product","price":11.99,"qty":3}], 1], "ACCEPTED");
    changeInternalOrderState(200, 1, ["2021/11/29 09:33", [{"SKUId":12,"description":"a product","price":10.99,"qty":3},
    {"SKUId":180,"description":"another product","price":11.99,"qty":3}], 1], ["COMPLETED", {"SkuID":1,"RFID":"12345678901234567890123456789016"},{"SkuID":1,"RFID":"12345678901234567890123456789038"}]);
    changeInternalOrderState(200, 1, ["2021/11/29 09:33", [{"SKUId":12,"description":"a product","price":10.99,"qty":3},
    {"SKUId":180,"description":"another product","price":11.99,"qty":3}], 1], ["ACCEPTED", {"SkuID":1,"RFID":"12345678901234567890123456789016"},{"SkuID":1,"RFID":"12345678901234567890123456789038"}]);
    changeInternalOrderState(422);
    deleteInternalOrder(200, 1, ["2021/11/29 09:33", [{"SKUId":12,"description":"a product","price":10.99,"qty":3},
    {"SKUId":180,"description":"another product","price":11.99,"qty":3}], 1]);
    deleteInternalOrder(422);
    deleteAllInternalOrders(204);
});

function getAllInternalOrders(expectedHTTPStatus, id, internalOrder) {
    it('getting all internalOrders data from the system', function (done) {
        agent.post('/api/internalOrder')
            .send(internalOrder)
            .then(function (res) {
                res.should.have.status(201);
                agent.get('/api/internalOrders')
                    .then(function (r) {
                        r.should.have.status(expectedHTTPStatus);
                        r.body.id.should.equal(id);
                        r.body.issueDate.should.equal(internalOrder.issueDate);
                        r.body.state.should.equal(null);
                        r.body.products.should.equal(internalOrder.products);
                        r.body.customerId.should.equal(internalOrder.customerId);
                        done();
                    });
            });
    });
}

function getInternalOrderById(expectedHTTPStatus, id, internalOrder) {
    it('getting internalOrder data from the system', function (done) {
        if (id !== undefined) {
            agent.post('/api/internalOrder')
                .send(internalOrder)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.get('/api/internalOrder/'+ id)
                        .then(function (r) {
                            r.should.have.status(expectedHTTPStatus);
                            r.body.id.should.equal(id);
                            r.body.issueDate.should.equal(internalOrder.issueDate);
                            r.body.state.should.equal(null);
                            r.body.products.should.equal(internalOrder.products);
                            r.body.customerId.should.equal(internalOrder.customerId);
                            done();
                        });
                });
        }
        else {
            agent.get('/api/internalOrder/') //we are not sending the id
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }
    });
}

function createInternalOrder(expectedHTTPStatus, internalOrder) {
    it('creating an internalOrder', function (done) {
        if (internalOrder !== undefined) {
            agent.post('/api/internalOrder')
                .send(internalOrder)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        } else {
            agent.post('/api/internalOrder') //we are not sending any data
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }

    });
}

function changeInternalOrderState(expectedHTTPStatus, id, internalOrder, newState) {
    it('changing an internalOrder state', function (done) {
        if (id !== undefined) {
            agent.post('/api/internalOrder')
                .send(internalOrder)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.put('/api/internalOrder/'+ id)
                        .send(newState)
                        .then(function (r) {
                            r.should.have.status(expectedHTTPStatus);
                            done();
                        });
                        
                });
        }
        else {
            agent.put('/api/internalOrder/') //we are not sending the id
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }
    });
}

function deleteInternalOrder(expectedHTTPStatus, id, internalOrder) {
    it('deleting an internalOrder', function (done) {
        if (id !== undefined) {
            agent.post('/api/internalOrder')
                .send(internalOrder)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.delete('/api/internalOrder/'+ id)
                        .then(function (r) {
                            r.should.have.status(expectedHTTPStatus);
                            done();
                        });
                        
                });
        }
        else {
            agent.delete('/api/internalOrder/') //we are not sending the id
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }
    });
}

function deleteAllInternalOrders(expectedHTTPStatus) {
    it('deleting all internalOrders', function (done) {
        agent.delete('/api/internalOrders')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}
