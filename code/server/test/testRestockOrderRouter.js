const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test restockOrder APIs', () => {

    beforeEach(async () => {
        await agent.delete('/api/restockOrders');
    })

    getAllRestockOrders(200, 1, {issueDate: "2021/11/29 09:33", products: [{"SKUId":12,"description":"a product","price":10.99,"qty":30},
    {"SKUId":180,"description":"another product","price":11.99,"qty":20}], supplierId: 1});
    getRestockOrderById(200, 1, {issueDate: "2021/11/29 09:33", products: [{"SKUId":12,"description":"a product","price":10.99,"qty":30},
    {"SKUId":180,"description":"another product","price":11.99,"qty":20}], supplierId: 1});
    getRestockOrderById(422);
    createRestockOrder(201, {issueDate: "2021/11/29 09:33", products: [{"SKUId":12,"description":"a product","price":10.99,"qty":30},
    {"SKUId":180,"description":"another product","price":11.99,"qty":20}], supplierId: 1});
    createRestockOrder(422);
    changeRestockOrderState(204, 1, {issueDate: "2021/11/29 09:33", products: [{"SKUId":12,"description":"a product","price":10.99,"qty":30},
    {"SKUId":180,"description":"another product","price":11.99,"qty":20}], supplierId: 1}, "DELIVERED");
    changeRestockOrderState(422);
    addTransportNoteRestockOrder(204, 1, {issueDate: "2021/11/29 09:33", products: [{"SKUId":12,"description":"a product","price":10.99,"qty":30},
    {"SKUId":180,"description":"another product","price":11.99,"qty":20}], supplierId: 1}, {deliveryDate:"2021/12/29"});
    addTransportNoteRestockOrder(422);
    deleteRestockOrder(204, 1, {issueDate: "2021/11/29 09:33", products: [{"SKUId":12,"description":"a product","price":10.99,"qty":30},
    {"SKUId":180,"description":"another product","price":11.99,"qty":20}], supplierId: 1});
    deleteRestockOrder(422);
    deleteAllRestockOrders(204);
});

function getAllRestockOrders(expectedHTTPStatus, id, restockOrder) {
    it('getting all restockOrders data from the system', function (done) {
        agent.post('/api/restockOrder')
            .send(restockOrder)
            .then(function (res) {
                res.should.have.status(201);
                agent.get('/api/restockOrders')
                    .then(function (r) {
                        r.should.have.status(expectedHTTPStatus);
                        r.body.id.should.equal(id);
                        r.body.issueDate.should.equal(restockOrder.issueDate);
                        r.body.state.should.equal("ISSUED");
                        r.body.products.should.equal(restockOrder.products);
                        r.body.supplierId.should.equal(restockOrder.supplierId);
                        done();
                    });
            });
    });
}

function getRestockOrderById(expectedHTTPStatus, id, restockOrder) {
    it('getting restockOrder data from the system', function (done) {
        if (id !== undefined) {
            agent.post('/api/restockOrder')
                .send(restockOrder)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.get('/api/restockOrder/'+ id)
                        .then(function (r) {
                            r.should.have.status(expectedHTTPStatus);
                            r.body.id.should.equal(id);
                            r.body.issueDate.should.equal(restockOrder.issueDate);
                            r.body.state.should.equal("ISSUED");
                            r.body.products.should.equal(restockOrder.products);
                            r.body.supplierId.should.equal(restockOrder.supplierId);
                        done();
                        });
                });
        }
        else {
            agent.get('/api/restockOrder/') //we are not sending the id
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }
    });
}

function createRestockOrder(expectedHTTPStatus, restockOrder) {
    it('creating a restockOrder', function (done) {
        if (restockOrder !== undefined) {
            agent.post('/api/restockOrder')
                .send(restockOrder)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        } else {
            agent.post('/api/restockOrder') //we are not sending any data
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }

    });
}

function changeRestockOrderState(expectedHTTPStatus, id, restockOrder, newState) {
    it('changing a restockOrder state', function (done) {
        if (id !== undefined) {
            agent.post('/api/restockOrder')
                .send(restockOrder)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.put('/api/restockOrder/'+ id)
                        .send(newState)
                        .then(function (r) {
                            r.should.have.status(expectedHTTPStatus);
                            done();
                        });
                        
                });
        }
        else {
            agent.put('/api/restockOrder/') //we are not sending the id
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }
    });
}

function addTransportNoteRestockOrder(expectedHTTPStatus, id, restockOrder, transportNote) {
    it('changing a restockOrder state', function (done) {
        if (id !== undefined) {
            agent.post('/api/restockOrder')
                .send(restockOrder)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.put('/api/restockOrder/'+ id + "/transportNote")
                        .send(transportNote)
                        .then(function (r) {
                            r.should.have.status(expectedHTTPStatus);
                            done();
                        });
                        
                });
        }
        else {
            agent.put('/api/restockOrder/') //we are not sending the id
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }
    });
}

function deleteRestockOrder(expectedHTTPStatus, id, restockOrder) {
    it('deleting a restockOrder', function (done) {
        if (id !== undefined) {
            agent.post('/api/restockOrder')
                .send(restockOrder)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.delete('/api/restockOrder/'+ id)
                        .then(function (r) {
                            r.should.have.status(expectedHTTPStatus);
                            done();
                        });
                        
                });
        }
        else {
            agent.delete('/api/restockOrder/') //we are not sending the id
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }
    });
}

function deleteAllRestockOrders(expectedHTTPStatus) {
    it('deleting all restockOrders', function (done) {
        agent.delete('/api/restockOrders')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}
