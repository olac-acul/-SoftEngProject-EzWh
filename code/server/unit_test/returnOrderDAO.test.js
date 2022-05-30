const returnOrderDAO = require('../modules/DAOs/returnOrderDAO');

describe('testReturnOrderDao', () => {
    beforeEach(async () => {
        await returnOrderDAO.dropTable();
        await returnOrderDAO.newReturnOrderTable();
    });

    test('delete all returnOrders', async () => {
        var res = await returnOrderDAO.getReturnOrders();
        expect(res.length).toStrictEqual(0);
    });

    testCreateReturnOrder_getReturnOrders_getReturnOrderById(1, {returnDate: "2021/11/29 09:33", products: [{"SKUId":12,"description":"a product","price":10.99,"RFID":"12345678901234567890123456789016"},
    {"SKUId":180,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"}],  restockOrderId: 1});
    testDeleteReturnOrder(1, {returnDate: "2021/11/29 09:33", products: [{"SKUId":12,"description":"a product","price":10.99,"RFID":"12345678901234567890123456789016"},
    {"SKUId":180,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"}],  restockOrderId: 1});
});

function testCreateReturnOrder_getReturnOrders_getReturnOrderById(id, returnOrder) {
    test('create new returnOrder and get all returnOrders and get a returnOrder by id', async () => {
        await returnOrderDAO.createReturnOrder(returnOrder);
        var res = await returnOrderDAO.getReturnOrders();
        expect(res.length).toStrictEqual(1);
        res = await returnOrderDAO.getReturnOrderById(id);
        // expect(res.returnDate).toStrictEqual(returnOrder.returnDate);
        // expect(res.restockOrderId).toStrictEqual(returnOrder.restockOrderId);
    });
}

function testDeleteReturnOrder(id, returnOrder){
    test("delete a returnOrder", async () => {
        await returnOrderDAO.createReturnOrder(returnOrder);
        await returnOrderDAO.deleteReturnOrder(id);   
        var res = await returnOrderDAO.getReturnOrderById(id);
        expect(res).toEqual("Not Found");
    });
}