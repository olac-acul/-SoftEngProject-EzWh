const userDAO = require('../modules/userDAO');

describe('testUserDao', () => {
    beforeEach(async () => {
        await userDAO.deleteUsers();
    });

    test('delete all Users', async () => {
        var res = await userDAO.getUsers();
        expect(res.length).toStrictEqual(0);
    });

    testAddUserAndGetUsersAndShowUserDetails([1, 'mail1', 'mario', 'rossi', 'alz', 'customer'], 'mail1');
    testModifyUserRights([1, 'mail1', 'mario', 'rossi', 'alz', 'customer'], 'mail1', 'customer', 'supplier');
    testLoginUser([1, 'mail1', 'mario', 'rossi', 'alz', 'customer'], 'mail1', 'alz', 'customer');
    testDeleteUser([1, 'mail1', 'mario', 'rossi', 'alz', 'customer'], 'customer');
});

function testAddUserAndGetUsersAndShowUserDetails(user, email){
    test('create new user and get all users and get suppliers', async () => {
        await userDAO.addUser(user);
        var res = await userDAO.getUsers();
        expect(res.length).toStrictEqual(1);
        res = await userDAO.showUserDetails(email);
        expect(res.id).toStrictEqual(user.id);
        expect(res.email).toStrictEqual(email);
        expect(res.name).toStrictEqual(user.name);
        expect(res.surname).toStrictEqual(user.surname);
        expect(res.type).toStrictEqual(user.type);
    });
}

function testModifyUserRights(user, email, oldType, newType){
    test('modify user rights', async () => {
        await userDAO.addUser(user);
        await userDAO.modifyUserRights(email, oldType, newType);
        var res = await userDAO.showUserDetails(email);
        expect(res.length).toStrictEqual(1);
        expect(res.type).toStrictEqual(newType);
    });
}

function testLoginUser(user, email, password, type){
    test('login user', async () => {
        await userDAO.addUser(user);
        var res = await userDAO.loginUser(email, password, type);
        expect(res.length).toStrictEqual(1);
        expect(res.id).toStrictEqual(user.id);
        expect(res.email).toStrictEqual(user.email);
        expect(res.name).toStrictEqual(user.name);
    });
}

function testDeleteUser(user, type){
    test('delete a user', async () => {
        await userDAO.addUser(user);
        await userDAO.deleteUser(user, type);
        var res = await userDAO.showUserDetails(email);
        expect(res).toStrictEqual('404');
    });
}