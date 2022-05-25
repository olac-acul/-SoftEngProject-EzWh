const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test SKU APIs', () => {

    beforeEach(async () => {
        await agent.delete('/api/skusAll');
    })

    getAllSKUs(200, 1, {description: "d1", weight: 100, volume: 50, notes: "n1", price: 10.99, availableQuantity: 50});
    getSKU(200, 1, {description: "d1", weight: 100, volume: 50, notes: "n1", price: 10.99, availableQuantity: 50});
    getSKU(422);
    addSKU(201, {description: "d1", weight: 100, volume: 50, notes: "n1", price: 10.99, availableQuantity: 50});
    addSKU(422);
    modifySKU(204, 1,{description: "d1", weight: 100, volume: 50, notes: "n1", price: 10.99, availableQuantity: 50}, {newDescription: "d2", newWeight: 150, newVolume: 100, newNotes: "n2", newPrice: 9.99, newAvailableQuantity: 100});
    modifySKU(422);
    modifySKUPosition(204, 1, {description: "d1", weight: 100, volume: 50, notes: "n1", price: 10.99, availableQuantity: 50}, "800234523412");
    modifySKUPosition(422);
    deleteSKU(204, 1, {description: "d1", weight: 100, volume: 50, notes: "n1", price: 10.99, availableQuantity: 50});
    deleteSKU(422);
    deleteAllSKUs(204);
});

function getAllSKUs(expectedHTTPStatus, id, SKU) {
    it('getting all SKUs data from the system', function (done) {
        agent.post('/api/sku')
            .send(SKU)
            .then(function (res) {
                res.should.have.status(201);
                agent.get('/api/skus')
                    .then(function (r) {
                        r.should.have.status(expectedHTTPStatus);
                        r.body.id.should.equal(id);
                        r.body.description.should.equal(SKU.descriptione);
                        r.body.weight.should.equal(SKU.weight);
                        r.body.volume.should.equal(SKU.volume);
                        r.body.notes.should.equal(SKU.notes);
                        r.body.availableQuantity.should.equal(SKU.availableQuantity);
                        r.body.price.should.equal(SKU.price);
                        done();
                    });
            });
    });
}

function getSKU(expectedHTTPStatus, id, SKU) {
    it('getting an SKU data from the system', function (done) {
        if (id !== undefined) {
            agent.post('/api/sku')
                .send(SKU)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.get('/api/sku/'+ id)
                        .then(function (r) {
                            r.should.have.status(expectedHTTPStatus);
                            r.body.id.should.equal(id);
                            r.body.description.should.equal(SKU.descriptione);
                            r.body.weight.should.equal(SKU.weight);
                            r.body.volume.should.equal(SKU.volume);
                            r.body.notes.should.equal(SKU.notes);
                            r.body.availableQuantity.should.equal(SKU.availableQuantity);
                            r.body.price.should.equal(SKU.price);
                            done();
                        });
                });
        }
        else {
            agent.get('/api/sku/') //we are not sending the id
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }
    });
}

function addSKU(expectedHTTPStatus, SKU) {
    it('creating an SKU', function (done) {
        if (SKU !== undefined) {
            agent.post('/api/sku')
                .send(SKU)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        } else {
            agent.post('/api/sku') //we are not sending any data
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }

    });
}

function modifySKU(expectedHTTPStatus, id, SKU, newState) {
    it('modifying an SKU', function (done) {
        if (id !== undefined) {
            agent.post('/api/sku')
                .send(SKU)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.put('/api/sku/'+ id)
                        .send(newState)
                        .then(function (r) {
                            r.should.have.status(expectedHTTPStatus);
                            done();
                        });
                        
                });
        }
        else {
            agent.put('/api/sku/') //we are not sending the id
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }
    });
}

function modifySKUPosition(expectedHTTPStatus, id, SKU, newPosition) {
    it('modifying an SKU position', function (done) {
        if (id !== undefined) {
            agent.post('/api/sku')
                .send(SKU)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.put("/api/sku/" + id + "/position")
                        .send(newPosition)
                        .then(function (r) {
                            r.should.have.status(expectedHTTPStatus);
                            done();
                        });
                        
                });
        }
        else {
            agent.put('/api/sku/') //we are not sending the id
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }
    });
}

function deleteSKU(expectedHTTPStatus, id, SKU) {
    it('deleting an SKU', function (done) {
        if (id !== undefined) {
            agent.post('/api/sku')
                .send(SKU)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.delete('/api/sku/'+ id)
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

function deleteAllSKUs(expectedHTTPStatus) {
    it('deleting all SKUs', function (done) {
        agent.delete('/api/skusAll')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}
