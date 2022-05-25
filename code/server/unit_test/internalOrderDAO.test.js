const internalOrderDAO = require('../modules/DAOs/internalOrderDAO');

describe('testInternalOrderDAO', () => {
    beforeEach(async () => {
        await internalOrderDAO.dropTable();
        await internalOrderDAO.newInternalOrdersTable();
    });

    test('delete all internalOrders', async () => {
        var res = await internalOrderDAO.getInternalOrders();
        expect(res.length).toStrictEqual(0);
    });

    testCreateInternalOrder_And_GetInternalOrders_And_GetInternalOrderById(1, {issueDate: "2021/11/29 09:33", customerId: 13}, {issueDate: "2021/11/22 09:33", customerId: 13});
    testModifyInternalOrder(1, {issueDate: "2021/11/29 09:33", customerId: 13},{issueDate: "2021/11/22 09:33", customerId: 13}, "ACCEPTED");
    testModifyInternalOrder(1, {issueDate: "2021/11/29 09:33",  customerId: 13},{issueDate: "2021/11/22 09:33", customerId: 13}, "COMPLETED");
    testDeleteInternalOrder(1, {issueDate: "2021/11/29 09:33", customerId: 13},{issueDate: "2021/11/22 09:33", customerId: 13});
});

function testCreateInternalOrder_And_GetInternalOrders_And_GetInternalOrderById(id, internalOrder1, internalOrder2) {
    test('create new internalOrder and get an internalOrder by id', async () => {
        await internalOrderDAO.createInternalOrder(internalOrder1);
        await internalOrderDAO.createInternalOrder(internalOrder2);
        var res = await internalOrderDAO.getInternalOrders();
        expect(res.length).toStrictEqual(2);
        res = await internalOrderDAO.getInternalOrderById(id);
        expect(res.issueDate).toStrictEqual(internalOrder1.issueDate);
        expect(res.state).toStrictEqual("ISSUED");
        expect(res.customerId).toStrictEqual(internalOrder1.customerId);
    });
}

function testModifyInternalOrder(id, internalOrder1, internalOrder2, newState){
    test("modify an internalOrder", async () => {
        await internalOrderDAO.createInternalOrder(internalOrder1);
        await internalOrderDAO.createInternalOrder(internalOrder2);
        await internalOrderDAO.changeStateInternalOrder(id, newState);  
        var res = await internalOrderDAO.getInternalOrderById(id);
        expect(res.id).toStrictEqual(id);
        expect(res.issueDate).toStrictEqual(internalOrder1.issueDate);
        expect(res.state).toStrictEqual(newState);
        expect(res.customerId).toStrictEqual(internalOrder1.customerId);
    });
}

function testDeleteInternalOrder(id, internalOrder1, internalOrder2){
    test("delete an internalOrder", async () => {
        await internalOrderDAO.createInternalOrder(internalOrder1);
        await internalOrderDAO.createInternalOrder(internalOrder2);
        await internalOrderDAO.deleteInternalOrder(id);   
        var res = await internalOrderDAO.getInternalOrderById(id);
        expect(res).toEqual("404");
    });
}
