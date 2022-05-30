const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test returnOrder APIs', () => {

    beforeEach(async () => {
        await agent.delete('/api/returnOrders');
    })

    getAllReturnOrders(200, 1, {returnDate: "2021/11/29 09:33", products: [{"SKUId":12,"description":"a product","price":10.99,"RFID":"12345678901234567890123456789016"},
    {"SKUId":180,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"}],  restockOrderId: 1});
    getReturnOrderById(200, 1, {returnDate: "2021/11/29 09:33", products: [{"SKUId":12,"description":"a product","price":10.99,"RFID":"12345678901234567890123456789016"},
    {"SKUId":180,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"}],  restockOrderId: 1});
    getReturnOrderById(422);
    createReturnOrder(201, {returnDate: "2021/11/29 09:33", products: [{"SKUId":12,"description":"a product","price":10.99,"RFID":"12345678901234567890123456789016"},
    {"SKUId":180,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"}],  restockOrderId: 1});
    createReturnOrder(422);
    deleteReturnOrder(204, 1, {returnDate: "2021/11/29 09:33", products: [{"SKUId":12,"description":"a product","price":10.99,"RFID":"12345678901234567890123456789016"},
    {"SKUId":180,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"}],  restockOrderId: 1});
    deleteReturnOrder(422);


});

function getAllReturnOrders(expectedHTTPStatus, id, returnOrder) {
    it('getting all returnOrders data from the system', function (done) {
        agent.post('/api/returnOrder')
            .send(returnOrder)
            .then(function (res) {
                res.should.have.status(201);
                agent.get('/api/returnOrders')
                    .then(function (r) {
                        r.should.have.status(expectedHTTPStatus);
                        r.body.id.should.equal(id);
                        r.body.returnDate.should.equal(returnOrder.returnDate);
                        r.body.products.should.equal(returnOrder.products);
                        r.body.restockOrderId.should.equal(returnOrder.restockOrderId);
                        done();
                    });
            });
    });
}

function getReturnOrderById(expectedHTTPStatus, id, returnOrder) {
    it('getting returnOrder data from the system', function (done) {
        if (id !== undefined) {
            agent.post('/api/returnOrder')
                .send(returnOrder)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.get('/api/returnOrder/'+ id)
                        .then(function (r) {
                            r.should.have.status(expectedHTTPStatus);
                            r.body.id.should.equal(id);
                            r.body.returnDate.should.equal(returnOrder.returnDate);
                            r.body.products.should.equal(returnOrder.products);
                            r.body.restockOrderId.should.equal(returnOrder.restockOrderId);
                        done();
                        });
                });
        }
        else {
            agent.get('/api/returnOrder/') //we are not sending the id
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }
    });
}

function createReturnOrder(expectedHTTPStatus, returnOrder) {
    it('creating a returnOrder', function (done) {
        if (returnOrder !== undefined) {
            agent.post('/api/returnOrder')
                .send(returnOrder)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        } else {
            agent.post('/api/returnOrder') //we are not sending any data
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }

    });
}

function deleteReturnOrder(expectedHTTPStatus, id, returnOrder) {
    it('deleting a returnOrder', function (done) {
        if (id !== undefined) {
            agent.post('/api/returnOrder')
                .send(returnOrder)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.delete('/api/returnOrder/'+ id)
                        .then(function (r) {
                            r.should.have.status(expectedHTTPStatus);
                            done();
                        });
                        
                });
        }
        else {
            agent.delete('/api/returnOrder/') //we are not sending the id
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }
    });
}