const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test item APIs', () => {

    beforeEach(async () => {
        await agent.delete('/api/items');
    })

    getAllItems(204, 12, "d1", 10.99, 8, 10);
    getItemById(200, 12, "d1", 10.99, 8, 10);
    getItemById(422);
    createItem(201, 12, "d1", 10.99, 8, 10);
    createItem(422);
    modifyItem(200, 12, "d1", 10.99, 8, 10, "d2", 9.99);
    modifyItem(422);
    deleteItem(200, 12, "d1", 10.99, 8, 10);
    deleteItem(422);
    deleteAllItems(204);
});

function getAllItems(expectedHTTPStatus, id, description, price, SKUId, supplierId) {
    it('getting all items data from the system', function (done) {
        let item = { id: id, description: description, price: price, SKUId: SKUId, supplierId: supplierId };
        agent.post('/api/item')
            .send(item)
            .then(function (res) {
                res.should.have.status(201);
                agent.get('/api/items')
                    .then(function (r) {
                        r.should.have.status(expectedHTTPStatus);
                        r.body.id.should.equal(id);
                        r.body.description.should.equal(description);
                        r.body.price.should.equal(price);
                        r.body.SKUId.should.equal(SKUId);
                        r.body.supplierId.should.equal(supplierId);
                        done();
                    });
            });
    });
}

function getItemById(expectedHTTPStatus, id, description, price, SKUId, supplierId) {
    it('getting item data from the system', function (done) {
        if (id !== undefined) {
            let item = { id: id, description: description, price: price, SKUId: SKUId, supplierId: supplierId };
            agent.post('/api/item')
                .send(item)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.get('/api/item/'+ id)
                        .then(function (r) {
                            r.should.have.status(expectedHTTPStatus);
                            r.body.id.should.equal(id);
                            r.body.description.should.equal(description);
                            r.body.price.should.equal(price);
                            r.body.SKUId.should.equal(SKUId);
                            r.body.supplierId.should.equal(supplierId);
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

function createItem(expectedHTTPStatus, id, description, price, SKUId, supplierId) {
    it('creating an item', function (done) {
        if (id !== undefined) {
            let item = { id: id, description: description, price: price, SKUId: SKUId, supplierId: supplierId };
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

function modifyItem(expectedHTTPStatus, id, description, price, SKUId, supplierId, newDescription, newPrice) {
    it('modifying an item', function (done) {
        if (id !== undefined) {
            let item = { id: id, description: description, price: price, SKUId: SKUId, supplierId: supplierId };
            let newState = { newDescription: newDescription, newPrice: newPrice };
            agent.post('/api/item')
                .send(item)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.put('/api/item/'+ id)
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

function deleteItem(expectedHTTPStatus, id, description, price, SKUId, supplierId) {
    it('deleting an item', function (done) {
        if (id !== undefined) {
            let item = { id: id, description: description, price: price, SKUId: SKUId, supplierId: supplierId };
            agent.post('/api/item')
                .send(item)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.delete('/api/item/'+ id)
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
        agent.delete('/api/items')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}
