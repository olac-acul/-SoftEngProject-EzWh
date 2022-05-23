const internalOrderDAO = require('../modules/internalOrderDAO');

describe('testInternalOrderDao', () => {
    beforeEach(async () => {
        await internalOrderDAO.deleteInternalOrders();
    });

    test('delete all internalOrders', async () => {
        var res = await internalOrderDAO.getInternalOrders();
        expect(res.length).toStrictEqual(0);
    });

    testCreateInternalOrder_And_GetInternalOrders_And_GetInternalOrderById(1, ["2021/11/29 09:33", 1]);
    testModifyInternalOrder(1, ["2021/11/29 09:33", 1], "ACCEPTED");
    testModifyInternalOrder(1, ["2021/11/29 09:33", 1], "COMPLETED");
    testDeleteInternalOrder(1, ["2021/11/29 09:33", 1]);
});

function testCreateInternalOrder_And_GetInternalOrders_And_GetInternalOrderById(id, internalOrder) {
    test('create new internalOrder and get all internalOrders and get an internalOrder by id', async () => {
        await internalOrderDAO.createInternalOrder(internalOrder);
        var res = await internalOrderDAO.getInternalOrders();
        expect(res.length).toStrictEqual(1);
        res = await internalOrderDAO.getInternalOrderById(id);
        expect(res.id).toStrictEqual(id);
        expect(res.issueDate).toStrictEqual(internalOrder.issueDate);
        expect(res.state).toStrictEqual("ISSUED");
        expect(res.customerId).toStrictEqual(internalOrder.customerId);
    });
}

function testModifyInternalOrder(id, internalOrder, newState){
    test("modify an internalOrder", async () => {
        await internalOrderDAO.createInternalOrder(internalOrder);
        await internalOrderDAO.changeStateInternalOrder(id, newState);  
        var res = await internalOrderDAO.getInternalOrderById(id);
        expect(res.length).toStrictEqual(1);
        expect(res.id).toStrictEqual(id);
        expect(res.issueDate).toStrictEqual(internalOrder.issueDate);
        expect(res.state).toStrictEqual(newState);
        expect(res.customerId).toStrictEqual(internalOrder.customerId);
    });
}

function testDeleteInternalOrder(id, internalOrder){
    test("delete an internalOrder", async () => {
        await internalOrderDAO.createInternalOrder(internalOrder);
        await internalOrderDAO.deleteInternalOrder(id);   
        var res = await internalOrderDAO.getInternalOrderById(id);
        expect(res).toEqual("404");
    });
}
