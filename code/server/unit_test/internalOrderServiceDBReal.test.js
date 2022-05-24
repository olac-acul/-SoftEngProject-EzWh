const InternalOrderService = require("../services/internalOrderService");
const internalOrderDAO = require("../DAOs/internalOrderDAO");
const internalOrderService = new InternalOrderService(internalOrderDAO);

describe("get internalOrders", () => {
    beforeEach(async () => {
        await internalOrderDAO.deleteInternalOrders();
        await internalOrderDAO.createInternalOrder({issueDate: "2021/11/29 09:33", products: [{"SKUId":12,"description":"a product","price":10.99,"qty":3},
        {"SKUId":180,"description":"another product","price":11.99,"qty":3}], customerId: 1});
    });
    testGetInternalOrders();
    testGetInternalOrderById();
});

async function testGetInternalOrders(){
    test("get internalOrders", async () => {
        let res = await internalOrderService.testGetInternalOrders();
        expect(res).toEqual({
            id:1,
            issueDate:"2021/11/29 09:33",
            state: "ACCEPTED",
            products: [{"SKUId":12,"description":"a product","price":10.99,"qty":2},
                {"SKUId":180,"description":"another product","price":11.99,"qty":3}],
            customerId : 1
        });
    });
}

async function testGetInternalOrderById(){
    test("get an internalOrder", async () => {
        const id = 1;
        let res = await internalOrderService.getInternalOrderById(id);
        expect(res).toEqual({
            id:1,
            issueDate:"2021/11/29 09:33",
            state: "ACCEPTED",
            products: [{"SKUId":12,"description":"a product","price":10.99,"qty":2},
                {"SKUId":180,"description":"another product","price":11.99,"qty":3}],
            customerId: 1
        });
    });
}

describe("create an internalOrder", () => {
    beforeEach(async () => {
        await internalOrderDAO.deleteInternalOrders();
    });
    testCreateInternalOrder();
});

async function testCreateInternalOrder(){
    test("create an internalOrder", async () => {
        const id = 1;
        const internalOrder = {
            issueDate:"2021/11/29 09:33",
            products: [{"SKUId":12,"description":"a product","price":10.99,"qty":2},
                {"SKUId":180,"description":"another product","price":11.99,"qty":3}],
            customerId : 1
        }
        let res = await internalOrderService.createInternalOrder(internalOrder);
        res = await internalOrderService.getInternalOrderById(id);
        expect(res).toEqual({
            id:1,
            issueDate:"2021/11/29 09:33",
            state: "ISSUED", 
            products: [{"SKUId":12,"description":"a product","price":10.99,"qty":2},
                {"SKUId":180,"description":"another product","price":11.99,"qty":3}],
            customerId : 1
        });
    });
}

describe("change an internalOrder state", () => {
    beforeEach(async () => {
        await internalOrderDAO.deleteInternalOrders();
        await internalOrderDAO.createInternalOrder({issueDate: "2021/11/29 09:33", products: [{"SKUId":12,"description":"a product","price":10.99,"qty":3},
        {"SKUId":180,"description":"another product","price":11.99,"qty":3}], customerId: 1});
    });
    testChangeInternalOrderStateWithStateACCEPTED();
    testChangeInternalOrderStateWithStateCOMPLETED();
    testChangeInternalOrderStateWithStateACCEPTEDWithProducts();
});

async function testChangeInternalOrderStateWithStateACCEPTED(){
    test("change an internalOrder state", async () => {
        const id = 1;
        const newStatus = "ACCEPTED";
        let res = await internalOrderService.changeStateInternalOrder(id, newStatus);
        res = await internalOrderService.getInternalOrderById(id);
        expect(res).toEqual({
            id:1,
            issueDate:"2021/11/29 09:33",
            state: "ACCEPTED",
            products: [{"SKUId":12,"description":"a product","price":10.99,"qty":2},
                {"SKUId":180,"description":"another product","price":11.99,"qty":3}],
            customerId : 1
        });
    });
}

async function testChangeInternalOrderStateWithStateCOMPLETED(){
    test("change an internalOrder state", async () => {
        const id = 1;
        const newStatus = {newState: "COMPLETED", products: [{"SKUId":12,"description":"a product","price":10.99,"qty":2},
        {"SKUId":180,"description":"another product","price":11.99,"qty":3}]};
        let res = await internalOrderService.changeStateInternalOrder(id, newStatus);
        res = await internalOrderService.getInternalOrderById(id);
        expect(res).toEqual({
            id:1,
            issueDate:"2021/11/29 09:33",
            state: "COMPLETED",
            products: [{"SKUId":12,"description":"a product","price":10.99,"qty":2},
                {"SKUId":180,"description":"another product","price":11.99,"qty":3}],
            customerId : 1
        });
    });
}
async function testChangeInternalOrderStateWithStateACCEPTEDWithProducts(){
    test("change an internalOrder state", async () => {
        const id = 1;
        const newStatus = {newState: "ACCEPTED", products: [{"SKUId":12,"description":"a product","price":10.99,"qty":2},
        {"SKUId":180,"description":"another product","price":11.99,"qty":3}]};
        let res = await internalOrderService.changeStateInternalOrder(id, newStatus);
        res = await internalOrderService.getInternalOrderById(id);
        expect(res).toEqual({
            id:1,
            issueDate:"2021/11/29 09:33",
            state: "ACCEPTED",
            products: [{"SKUId":12,"description":"a product","price":10.99,"qty":2},
                {"SKUId":180,"description":"another product","price":11.99,"qty":3}],
            customerId : 1
        });
    });
}
describe("delete an internalOrder", () => {
    beforeEach(async () => {
        await internalOrderDAO.deleteInternalOrders();
        await internalOrderDAO.createInternalOrder({issueDate: "2021/11/29 09:33", products: [{"SKUId":12,"description":"a product","price":10.99,"qty":3},
        {"SKUId":180,"description":"another product","price":11.99,"qty":3}], customerId: 1});
    });
    testDeleteInternalOrder();
});

async function testDeleteInternalOrder(){
    test("delete an internalOrder", async () => {
        const id = 1;
        let res = await internalOrderService.deleteInternalOrder(id);
        res = await internalOrderService.getInternalOrderById(id);
        expect(res).toEqual("404");
    });
}
