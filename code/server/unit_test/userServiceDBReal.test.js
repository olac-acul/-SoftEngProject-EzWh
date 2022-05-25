const userService = require("../modules/services/userService");
const userDAO = require("../modules/DAOs/userDAO");
const user_Service = new userService(userDAO);

describe("get users", () => {
    beforeEach(async () => {
        await userDAO.dropTable();
        await userDAO.newUserTable();
        await userDAO.addUser({id: 1, email: 'mail1', name: 'mario', surname: 'rossi', password: 'alz', type: 'customer'});
    });
    testGetUsersExceptManager();
});

async function testGetUsersExceptManager(){
    test("get users", async () => {
        let res = await user_Service.getUsersExceptManager();
        expect(res[0]).toEqual({
            id: 1,
            email: 'mail1',
            name: 'mario',
            surname: 'rossi',
            password: 'alz',
            type: 'customer'
        });
    });
}

describe("create a user", () => {
    beforeEach(async () => {
        await userDAO.dropTable();
        await userDAO.newUserTable();
    });
    testAddUser();
});

async function testAddUser(){
    test("create a user", async () => {
        const email = 'mail1';
        const user = {
            id: 1,
            email: 'mail1',
            name: 'mario',
            surname: 'rossi',
            password: 'alz',
            type: 'customer'
        };
        let res = await user_Service.addUser(user);
        res = await user_Service.getUsersExceptManager();
        expect(res[0]).toEqual({
            id: 1,
            email: 'mail1',
            name: 'mario',
            surname: 'rossi',
            password: 'alz',
            type: 'customer'
        });
    });
}

describe("login user", () => {
    beforeEach(async () => {
        await userDAO.dropTable();
        await userDAO.newUserTable();
        await userDAO.addUser({id: 1, email: 'mail1', name: 'mario', surname: 'rossi', password: 'alz', type: 'customer'});
    });
    testLoginUser();
});

async function testLoginUser(){
    test("login user", async () => {
        const email = 'mail1';
        const password = 'alz';
        const type = 'customer';
        let res = await user_Service.loginUser(email, password, type);
        expect(res).toEqual({
            id: 1,
            email: 'mail1',
            name: 'mario'
        });
    });
}

describe("modify user rights", () => {
    beforeEach(async () => {
        await userDAO.dropTable();
        await userDAO.newUserTable();
        await userDAO.addUser({id: 1, email: 'mail1', name: 'mario', surname: 'rossi', password: 'alz', type: 'customer'});
    });
    testModifyUserRights();
});

async function testModifyUserRights(){
    test("modify user rights", async () => {
        const email = 'mail1';
        const oldType = 'customer';
        const newType = 'supplier';
        let res = await user_Service.modifyUserRights(email, oldType, newType);
        res = await user_Service.getUsersExceptManager();
        expect(res[0]).toEqual({
            id: 1,
            email: 'mail1',
            name: 'mario',
            surname: 'rossi',
            password: 'alz',
            type: 'supplier'
        });
    });
}

describe("delete a user", () => {
    beforeEach(async () => {
        await userDAO.dropTable();
        await userDAO.newUserTable();
        await userDAO.addUser({id: 1, email: 'mail1', name: 'mario', surname: 'rossi', password: 'alz', type: 'customer'});
    });
    testDeleteUser();
});

async function testDeleteUser(){
    test("delete a user", async () => {
        const email = 'mail1';
        const type = 'customer';
        let res = await user_Service.deleteUser(email, type);
        res = await user_Service.getUsersExceptManager();
        expect(res.length).toEqual(0);
    });
}

