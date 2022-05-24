const restockOrderDAO = require('../modules/restockOrderDAO');

describe('testRestockOrderDAO', () => {
    beforeEach(async () => {
        await restockOrderDAO.deleteRestockOrders();
    });

    test('delete all restockOrders', async () => {
        var res = await restockOrderDAO.getRestockOrders();
        expect(res.length).toStrictEqual(0);
    });

    testCreateRestockOrder_And_GetRestockOrders_And_GetRestockOrderById(1, {issueDate: "2021/11/29 09:33", products: [{"SKUId":12,"description":"a product","price":10.99,"qty":30},
    {"SKUId":180,"description":"another product","price":11.99,"qty":20}],  supplierId: 1});
    testChangeStateRestockOrder(1, {issueDate: "2021/11/29 09:33", products: [{"SKUId":12,"description":"a product","price":10.99,"qty":30},
    {"SKUId":180,"description":"another product","price":11.99,"qty":20}],  supplierId: 1}, "DELIVERED");
    testAddTransportNoteRestockOrder(1, {issueDate: "2021/11/29 09:33", products: [{"SKUId":12,"description":"a product","price":10.99,"qty":30},
    {"SKUId":180,"description":"another product","price":11.99,"qty":20}],  supplierId: 1}, {deliveryDate:"2021/12/29"});
    testDeleteRestockOrder(1, {issueDate: "2021/11/29 09:33", products: [{"SKUId":12,"description":"a product","price":10.99,"qty":30},
    {"SKUId":180,"description":"another product","price":11.99,"qty":20}],  supplierId: 1});
});

function testCreateRestockOrder_And_GetRestockOrders_And_GetRestockOrderById(id, restockOrder) {
    test('create new restockOrder and get all restockOrders and get an restockOrder by id', async () => {
        await restockOrderDAO.createRestockOrder(restockOrder);
        var res = await restockOrderDAO.getRestockOrders();
        expect(res.length).toStrictEqual(1);
        res = await restockOrderDAO.getRestockOrderById(id);
        expect(res.id).toStrictEqual(id);
        expect(res.issueDate).toStrictEqual(restockOrder.issueDate);
        expect(res.state).toStrictEqual("ISSUED");
        expect(res.products).toStrictEqual(restockOrder.products);
        expect(res.supplierId).toStrictEqual(restockOrder.supplierId);
    });
}

function testChangeStateRestockOrder(id, restockOrder, newState){
    test("change a restockOrder state", async () => {
        await restockOrderDAO.createRestockOrder(restockOrder);
        await restockOrderDAO.changeStateRestockOrder(id, newState);  
        var res = await restockOrderDAO.getRestockOrderById(id);
        expect(res.length).toStrictEqual(1);
        expect(res.id).toStrictEqual(id);
        expect(res.issueDate).toStrictEqual(restockOrder.issueDate);
        expect(res.state).toStrictEqual(newState);
        expect(res.products).toStrictEqual(restockOrder.products);
        expect(res.supplierId).toStrictEqual(restockOrder.supplierId);
    });
}

function testAddTransportNoteRestockOrder(id, restockOrder, transportNote){
    test("add transportNote to a restockOrder", async () => {
        await restockOrderDAO.createRestockOrder(restockOrder);
        await restockOrderDAO.addTransportNoteRestockOrder(id, transportNote.deliveryDate);  
        var res = await restockOrderDAO.getRestockOrderById(id);
        expect(res.length).toStrictEqual(1);
        expect(res.id).toStrictEqual(id);
        expect(res.issueDate).toStrictEqual(restockOrder.issueDate);
        expect(res.state).toStrictEqual("ISSUED");
        expect(res.products).toStrictEqual(restockOrder.products);
        expect(res.supplierId).toStrictEqual(restockOrder.supplierId);
        expect(res.transportNote).toStrictEqual(transportNote);
    });
}

function testDeleteRestockOrder(id, restockOrder){
    test("delete a restockOrder", async () => {
        await restockOrderDAO.createRestockOrder(restockOrder);
        await restockOrderDAO.deleteRestockOrder(id);   
        var res = await restockOrderDAO.getRestockOrderById(id);
        expect(res).toEqual("404");
    });
}
