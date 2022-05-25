const ReturnOrderService = require("../modules/services/returnOrderService");
const returnOrderDAO = require("../modules/mockDAOs/mockReturnOrderDAO");
const returnOrderService = new ReturnOrderService(returnOrderDAO);

describe("get returnOrders", () => {
    beforeEach(async () => {
        await returnOrderDAO.dropTable();
        await returnOrderDAO.newReturnOrderTable();
        await returnOrderDAO.createReturnOrder({returnDate: "2021/11/29 09:33", /*products: [{"SKUId":12,"description":"a product","price":10.99,"RFID":"12345678901234567890123456789016"},
        {"SKUId":180,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"}],*/  restockOrderId: 1});
    });
    testGetReturnOrderById();
});

async function testGetReturnOrderById(){
    test("get a returnOrder", async () => {
        const id = 1;
        let res = await returnOrderService.getReturnOrderById(id);
        expect(res).toEqual({
            returnDate: "2021/11/29 09:33",
            restockOrderId : 1
        });
    });
}

describe("create a returnOrder", () => {
    beforeEach(async () => {
        await returnOrderDAO.dropTable();
        await returnOrderDAO.newReturnOrderTable();
    });
    testCreateReturnOrder();
});

async function testCreateReturnOrder(){
    test("create a returnOrder", async () => {
        const id = 1;
        const returnOrder = {
            returnDate: "2021/11/29 09:33",
            products: [],
            restockOrderId : 1
        }
        let res = await returnOrderService.createReturnOrder(returnOrder);
        res = await returnOrderService.getReturnOrderById(id);
        expect(res).toEqual({
            returnDate: "2021/11/29 09:33",
            restockOrderId : 1
        });
    });
}

describe("delete a returnOrder", () => {
    beforeEach(async () => {
        await returnOrderDAO.dropTable();
        await returnOrderDAO.newReturnOrderTable();
        await returnOrderDAO.createReturnOrder({returnDate: "2021/11/29 09:33",  restockOrderId: 1});
    });
    testDeleteReturnOrder();
});

async function testDeleteReturnOrder(){
    test("delete a returnOrder", async () => {
        const id = 1;
        let res = await returnOrderService.deleteReturnOrder(id);
        res = await returnOrderService.getReturnOrderById(id);
        expect(res).toEqual("404");
    });
}