const chai = require('chai');
const chaiHttp = require('chai-http');
const PositionService = require('../modules/services/positionService');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test user APIs', () => {
    beforeEach(async () => {
        await agent.delete('/api/usersAll');
    })

    getSuppliers(200, 'mail1', {id: 1, email: 'mail1', name:'mario', surname: 'rossi', password: 'alz', type: 'supplier'});
    getUsersExceptManager(200, 'mail1', {id: 1, email: 'mail1', name: 'mario', surname: 'rossi', password: 'alz', type: 'customer'});
    addUser(201, {id: 1, email: 'mail1', name: 'mario', surname: 'rossi', password: 'alz', type: 'customer'});
    addUser(422);
    loginManager(200, {username: "user1@ezwh.com", password: "testpassword"})
    loginManager(422);
    modifyUserRights(204, {id: 1, email: 'mail1', name: 'mario', surname: 'rossi', password: 'alz', type: 'customer'}, 'mail1', 'supplier');
    modifyUserRights(422);
    deleteUser(204, {id: 1, email: 'mail1', name: 'mario', surname: 'rossi', password: 'alz', type: 'customer'}, 'mail1', 'customer');
    deleteUser(422);
});

function getSuppliers(expectedHTTPStatus, email, user) {
    it('getting all userss data from the system', function (done) {
        agent.post('/api/newUser')
            .send(user)
            .then(function (res) {
                res.should.have.status(201);
                agent.get('/api/suppliers')
                    .then(function (r) {
                        r.should.have.status(expectedHTTPStatus);
                        r.body.id.should.equal(user.id);
                        r.body.email.should.equal(email);
                        r.body.name.should.equal(user.name);
                        r.body.surname.should.equal(user.surname);
                        r.body.password.should.equal(password);
                        r.body.type.should.equal(type);
                        done();
                    });
            });
    });
}

function getUsersExceptManager(expectedHTTPStatus, email, user) {
    it('getting all users data from the system', function (done) {
        agent.post('/api/newUser')
            .send(user)
            .then(function (res) {
                res.should.have.status(201);
                agent.get('/api/users')
                    .then(function (r) {
                        r.should.have.status(expectedHTTPStatus);
                        r.body.id.should.equal(user.id);
                        r.body.email.should.equal(email);
                        r.body.name.should.equal(user.name);
                        r.body.surname.should.equal(user.surname);
                        r.body.password.should.equal(password);
                        r.body.type.should.equal(type);
                        done();
                    });
            });
    });
}

function addUser(expectedHTTPStatus, user) {
    it('creating a user', function (done) {
        if (user !== undefined) {
            agent.post('/api/newUser')
                .send(user)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        } else {
            agent.post('/api/newUser') //we are not sending any data
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }

    });
}

function loginManager(expectedHTTPStatus, user) {
    it('login manager', function (done) {
        if (user !== undefined) {
            agent.post('/api/managerSessions')
                .send(user)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        } else {
            agent.post('/api/managerSessions') //we are not sending any data
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }

    });
}

function modifyUserRights(expectedHTTPStatus, user, username, newType) {
    it('modifying user rights', function (done) {
        if (username !== undefined) {
            let updatedUser = {id: user.id, email: user.email, name: user.name, surname: user.surname, password: user.password, type: newType}
            agent.put('/api/users/' + username)
                .send(updatedUser)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                });
        }
        else {
            agent.put('/api/users/') //we are not sending the id
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }
    });
}

function deleteUser(expectedHTTPStatus, user, email, type) {
    it('deleting a user', function (done) {
        if (email !== undefined) {
            agent.post('/api/newUser')
                .send(user)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.delete('/api/users/'+ email + '/' + type)
                        .then(function (r) {
                            r.should.have.status(expectedHTTPStatus);
                            done();
                        });
                        
                });
        }
        else {
            agent.delete('/api/users/') //we are not sending the positionID
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }
    });
}