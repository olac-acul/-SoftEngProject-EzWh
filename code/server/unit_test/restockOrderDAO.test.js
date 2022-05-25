const restockOrderDAO = require('../modules/DAOs/restockOrderDAO');

describe('testRestockOrderDAO', () => {
    beforeEach(async () => {
        await restockOrderDAO.dropTable();
        await restockOrderDAO.newRestockOrderTable();
    });

    test('delete all restockOrders', async () => {
        var res = await restockOrderDAO.getRestockOrders();
        expect(res.length).toStrictEqual(0);
    });

    testCreateRestockOrder_And_GetRestockOrders_And_GetRestockOrderById(1, {issueDate: "2021/11/29 09:33",  supplierId: 8}, {issueDate: "2021/11/22 09:33", supplierId: 10});
    testChangeStateRestockOrder(1, {issueDate: "2021/11/29 09:33",  supplierId: 8}, {issueDate: "2021/11/22 09:33",  supplierId: 10}, "DELIVERED");
    testAddTransportNoteRestockOrder(1, {issueDate: "2021/11/29 09:33",  supplierId: 8}, {issueDate: "2021/11/22 09:33",  supplierId: 10}, {deliveryDate:"2021/12/29"});
    testDeleteRestockOrder(1, {issueDate: "2021/11/29 09:33",  supplierId: 8}, {issueDate: "2021/11/22 09:33",  supplierId: 10});
});

function testCreateRestockOrder_And_GetRestockOrders_And_GetRestockOrderById(id, restockOrder1 , restockOrder2) {
    test('create new restockOrder and get all restockOrders and get an restockOrder by id', async () => {
        await restockOrderDAO.createRestockOrder(restockOrder1);
        await restockOrderDAO.createRestockOrder(restockOrder2);
        var res = await restockOrderDAO.getRestockOrders();
        expect(res.length).toStrictEqual(2);
        res = await restockOrderDAO.getRestockOrderById(id);
        expect(res.id).toStrictEqual(id);
        expect(res.issueDate).toStrictEqual(restockOrder1.issueDate);
        expect(res.state).toStrictEqual("ISSUED");
        expect(res.supplierId).toStrictEqual(restockOrder1.supplierId);
    });
}

function testChangeStateRestockOrder(id, restockOrder1, restockOrder2, newState){
    test("change a restockOrder state", async () => {
        await restockOrderDAO.createRestockOrder(restockOrder1);
        await restockOrderDAO.createRestockOrder(restockOrder2);
        await restockOrderDAO.changeStateRestockOrder(id, newState);  
        var res = await restockOrderDAO.getRestockOrderById(id);
        expect(res.id).toStrictEqual(id);
        expect(res.issueDate).toStrictEqual(restockOrder1.issueDate);
        expect(res.state).toStrictEqual(newState);
        expect(res.supplierId).toStrictEqual(restockOrder1.supplierId);
    });
}

function testAddTransportNoteRestockOrder(id, restockOrder1, restockOrder2, transportNote){
    test("add transportNote to a restockOrder", async () => {
        await restockOrderDAO.createRestockOrder(restockOrder1);
        await restockOrderDAO.createRestockOrder(restockOrder2);
        await restockOrderDAO.addTransportNoteRestockOrder(id, transportNote);  
        var res = await restockOrderDAO.getRestockOrderById(id);
        expect(res.id).toStrictEqual(id);
        expect(res.issueDate).toStrictEqual(restockOrder1.issueDate);
        expect(res.state).toStrictEqual("ISSUED");
        expect(res.supplierId).toStrictEqual(restockOrder1.supplierId);
        expect(res.transportNote).toStrictEqual(transportNote);
    });
}

function testDeleteRestockOrder(id, restockOrder1, restockOrder2){
    test("delete a restockOrder", async () => {
        await restockOrderDAO.createRestockOrder(restockOrder1);
        await restockOrderDAO.createRestockOrder(restockOrder2);
        await restockOrderDAO.deleteRestockOrder(id);   
        var res = await restockOrderDAO.getRestockOrders();
        expect(res.length).toEqual(1);
    });
}
