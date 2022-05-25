const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test item APIs', () => {

    beforeEach(async () => {
        await agent.delete('/api/itemsAll');
    })

    getAllItems(200, {id: 12, description: "d1", price: 10.99, SKUId: 8, supplierId: 10});
    getItemById(200, {id: 12, description: "d1", price: 10.99, SKUId: 8, supplierId: 10});
    getItemById(422);
    createItem(201, {id: 12, description: "d1", price: 10.99, SKUId: 8, supplierId: 10});
    createItem(422);
    modifyItem(204, {id: 12, description: "d1", price: 10.99, SKUId: 8, supplierId: 10}, {newDescription: "d2", newPrice: 9.99});
    modifyItem(422);
    deleteItem(204, {id: 12, description: "d1", price: 10.99, SKUId: 8, supplierId: 10});
    deleteItem(422);
    deleteAllItems(204);
});

function getAllItems(expectedHTTPStatus, item) {
    it('getting all items data from the system', function (done) {
        agent.post('/api/item')
            .send(item)
            .then(function (res) {
                res.should.have.status(201);
                agent.get('/api/items')
                    .then(function (r) {
                        r.should.have.status(expectedHTTPStatus);
                        r.body.id.should.equal(item.id);
                        r.body.description.should.equal(item.description);
                        r.body.price.should.equal(item.price);
                        r.body.SKUId.should.equal(item.SKUId);
                        r.body.supplierId.should.equal(item.supplierId);
                        done();
                    });
            });
    });
}

function getItemById(expectedHTTPStatus, item) {
    it('getting item data from the system', function (done) {
        if (id !== undefined) {
            agent.post('/api/item')
                .send(item)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.get('/api/item/'+ item.id)
                        .then(function (r) {
                            r.should.have.status(expectedHTTPStatus);
                            r.body.id.should.equal(item.id);
                            r.body.description.should.equal(item.description);
                            r.body.price.should.equal(item.price);
                            r.body.SKUId.should.equal(item.SKUId);
                            r.body.supplierId.should.equal(item.supplierId);
                            done();
                        });
                });
        }
        else {
            agent.get('/api/item/') //we are not sending the id
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }
    });
}

function createItem(expectedHTTPStatus, item) {
    it('creating an item', function (done) {
        if (item !== undefined) {
            agent.post('/api/item')
                .send(item)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        } else {
            agent.post('/api/item') //we are not sending any data
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }

    });
}

function modifyItem(expectedHTTPStatus, item, newState) {
    it('modifying an item', function (done) {
        if (id !== undefined) {
            agent.post('/api/item')
                .send(item)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.put('/api/item/'+ item.id)
                        .send(newState)
                        .then(function (r) {
                            r.should.have.status(expectedHTTPStatus);
                            done();
                        });
                        
                });
        }
        else {
            agent.put('/api/item/') //we are not sending the id
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }
    });
}

function deleteItem(expectedHTTPStatus, item) {
    it('deleting an item', function (done) {
        if (id !== undefined) {
            agent.post('/api/item')
                .send(item)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.delete('/api/item/'+ item.id)
                        .then(function (r) {
                            r.should.have.status(expectedHTTPStatus);
                            done();
                        });
                        
                });
        }
        else {
            agent.delete('/api/item/') //we are not sending the id
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }
    });
}

function deleteAllItems(expectedHTTPStatus) {
    it('deleting all items', function (done) {
        agent.delete('/api/itemsAll')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}
