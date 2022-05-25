const InternalOrderService = require("../modules/services/internalOrderService");
const internalOrderDAO = require("../modules/DAOs/internalOrderDAO");
const internalOrderService = new InternalOrderService(internalOrderDAO);

describe("get an internalOrder", () => {
    beforeEach(async () => {
        await internalOrderDAO.dropTable();
        await internalOrderDAO.newInternalOrdersTable();
        await internalOrderDAO.createInternalOrder({issueDate: "2021/11/29 09:33", customerId: 13});
        await internalOrderDAO.createInternalOrder({issueDate: "2021/11/22 09:33",customerId: 13});
    });
    testGetInternalOrderById();
});

async function testGetInternalOrderById(){
    test("get an internalOrder", async () => {
        const id = 1;
        let res = await internalOrderService.getInternalOrderById(id);
        expect(res).toEqual({
            id:1,
            issueDate:"2021/11/29 09:33",
            state: "ISSUED",
            products: [],
            customerId: 13
        });
    });
}

describe("create an internalOrder", () => {
    beforeEach(async () => {
        await internalOrderDAO.dropTable();
        await internalOrderDAO.newInternalOrdersTable();
    });
    testCreateInternalOrder();
});

async function testCreateInternalOrder(){
    test("create an internalOrder", async () => {
        const id = 1;
        const internalOrder1 = {
            issueDate:"2021/11/29 09:33",
            products: [],
            customerId : 13
        };
        await internalOrderService.createInternalOrder(internalOrder1);
        res = await internalOrderService.getInternalOrderById(id);
        expect(res).toEqual({
            id:1,
            issueDate:"2021/11/29 09:33",
            state: "ISSUED", 
            products: [],
            customerId : 13
        });
    });
}

describe("change an internalOrder state", () => {
    beforeEach(async () => {
        await internalOrderDAO.dropTable();
        await internalOrderDAO.newInternalOrdersTable();
        await internalOrderDAO.createInternalOrder({issueDate: "2021/11/29 09:33", customerId: 13});
        await internalOrderDAO.createInternalOrder({issueDate: "2021/11/22 09:33", customerId: 13});

    });
    testChangeInternalOrderStateWithStateACCEPTED();
    testChangeInternalOrderStateWithStateCOMPLETED();
    testChangeInternalOrderStateWithStateACCEPTEDWithProducts();
});

async function testChangeInternalOrderStateWithStateACCEPTED(){
    test("change an internalOrder state", async () => {
        const id = 1;
        const newStatus = {newState: "ACCEPTED"};
        let res = await internalOrderService.changeStateInternalOrder(id, newStatus);
        res = await internalOrderService.getInternalOrderById(id);
        expect(res).toEqual({
            id:1,
            issueDate:"2021/11/29 09:33",
            state: "ACCEPTED",
            products: [],
            customerId : 13
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
            customerId : 13
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
            products: [],
            customerId : 13
        });
    });
}
describe("delete an internalOrder", () => {
    beforeEach(async () => {
        await internalOrderDAO.dropTable();
        await internalOrderDAO.newInternalOrdersTable();
        await internalOrderDAO.createInternalOrder({issueDate: "2021/11/29 09:33", customerId: 13});
        await internalOrderDAO.createInternalOrder({issueDate: "2021/11/22 09:33", customerId: 13});
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
