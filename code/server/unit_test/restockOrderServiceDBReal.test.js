const RestockOrderService = require("../modules/services/restockOrderService");
const restockOrderDAO = require("../modules/DAOs/restockOrderDAO");
const restockOrderService = new RestockOrderService(restockOrderDAO);

describe("get restockOrders", () => {
    beforeEach(async () => {
        await restockOrderDAO.dropTable();
        await restockOrderDAO.newRestockOrderTable();
        await restockOrderDAO.createRestockOrder({issueDate: "2021/11/29 09:33",  supplierId: 8});
        await restockOrderDAO.createRestockOrder({issueDate: "2021/11/22 09:33",  supplierId: 10});
    });
    testGetRestockOrderById();
});


async function testGetRestockOrderById(){
    test("get a restockOrder", async () => {
        const id = 1;
        let res = await restockOrderService.getRestockOrderById(id);
        expect(res[0]).toEqual({
            id:1,
            issueDate:"2021/11/29 09:33",
            products: [],
            state: "ISSUED",
            supplierId : 8,
            transportNote: {deliveryDate: null},
            skuItems: null
        });
    });
}

describe("create a restockOrder", () => {
    beforeEach(async () => {
        await restockOrderDAO.dropTable();
        await restockOrderDAO.newRestockOrderTable();
    });
    testCreateRestockOrder();
});

async function testCreateRestockOrder(){
    test("create a restockOrder", async () => {
        const restockOrder1 = {
            issueDate:"2021/11/29 09:33",
            products: [],
            supplierId : 8
        };
        await restockOrderService.createRestockOrder(restockOrder1);
        res = await restockOrderService.getRestockOrders();
        expect(res[0]).toEqual({
            id:1,
            issueDate:"2021/11/29 09:33",
            state: "ISSUED",
            products: [],
            supplierId : 8,
            transportNote: {deliveryDate: null},
            skuItems: null
        });
    });
}

describe("change a restockOrder state", () => {
    beforeEach(async () => {
        await restockOrderDAO.dropTable();
        await restockOrderDAO.newRestockOrderTable();
        await restockOrderDAO.createRestockOrder({issueDate: "2021/11/29 09:33",  supplierId: 8});
        await restockOrderDAO.createRestockOrder({issueDate: "2021/11/22 09:33", supplierId: 10});
    });
    testChangeRestockOrderState();
});

async function testChangeRestockOrderState(){
    test("change a restockOrder state", async () => {
        const id = 1;
        const newState = "DELIVERED";
        await restockOrderService.changeStateRestockOrder(id, newState);
        res = await restockOrderService.getRestockOrderById(id);
        expect(res).toEqual({
            id:1,
            issueDate:"2021/11/29 09:33",
            state: "DELIVERED",
            products: [],
            supplierId : 8,
            transportNote: {deliveryDate: null},
            skuItems: null
        });
    });
}

describe("add transportNote to a restockOrder", () => {
    beforeEach(async () => {
        await restockOrderDAO.dropTable();
        await restockOrderDAO.newRestockOrderTable();
        await restockOrderDAO.createRestockOrder({issueDate: "2021/11/29 09:33",  supplierId: 8});
        await restockOrderDAO.createRestockOrder({issueDate: "2021/11/22 09:33", supplierId: 10});
    });
    testAddTransportNote();
});

async function testAddTransportNote(){
    test("add transportNote to a restockOrder", async () => {
        const id = 1;
        const transportNote = {deliveryDate:"2021/12/29"};
        await restockOrderService.addTransportNoteRestockOrder(id, transportNote);
        res = await restockOrderService.getRestockOrderById(id);
        expect(res).toEqual({
            id:1,
            issueDate:"2021/11/29 09:33",
            state: "ISSUED",
            products: [],
            supplierId : 8,
            transportNote: {deliveryDate:"2021/12/29"},
            skuItems: null
        });
    });
}

describe("delete a restockOrder", () => {
    beforeEach(async () => {
        await restockOrderDAO.dropTable();
        await restockOrderDAO.newRestockOrderTable();
        await restockOrderDAO.createRestockOrder({issueDate: "2021/11/29 09:33",  supplierId: 8});
        await restockOrderDAO.createRestockOrder({issueDate: "2021/11/22 09:33",  supplierId: 10});
    });
    testDeleteRestockOrder();
});

async function testDeleteRestockOrder(){
    test("delete a restockOrder", async () => {
        const id = 1;
        await restockOrderService.deleteRestockOrder(id);
        res = await restockOrderService.getRestockOrders();
        expect(res.length).toEqual(1);
    });
}
