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

    getAllItems(204, [12, "d1", 10.99, 8, 10]);
    getItemById(200, [12, "d1", 10.99, 8, 10]);
    getItemById(422);
    createItem(201, [12, "d1", 10.99, 8, 10]);
    createItem(422);
    modifyItem(200, [12, "d1", 10.99, 8, 10], ["d2", 9.99]);
    modifyItem(422);
    deleteItem(200, [12, "d1", 10.99, 8, 10]);
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
                        r.body.description.should.equal(item.descriptione);
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
                            r.body.description.should.equal(item.descriptione);
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

function modifyItem(expectedHTTPStatus, item, newStatus) {
    it('modifying an item', function (done) {
        if (id !== undefined) {
            agent.post('/api/item')
                .send(item)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.put('/api/item/'+ item.id)
                        .send(newStatus)
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
        if (item !== undefined) {
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
        agent.delete('/api/items')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}
