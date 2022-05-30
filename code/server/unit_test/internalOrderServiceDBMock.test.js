const InternalOrderService = require("../modules/services/internalOrderService");
const internalOrderDAO = require("../modules/mockDAOs/mockInternalOrderDAO");
const internalOrderService = new InternalOrderService(internalOrderDAO);

describe("get an internalOrder", () => {
    internalOrderDAO.getInternalOrderById.mockReturnValue({
        id:1,
        issueDate:"2021/11/29 09:33",
        state: "ACCEPTED",
        products: [{"SKUId":12,"description":"a product","price":10.99,"qty":2},
                    {"SKUId":180,"description":"another product","price":11.99,"qty":3}],
        customerId : 13
    });
    test("get an internalOrder", async () => {
        const id = 108;
        let res = await internalOrderService.getInternalOrderById(id);
        expect(res).toEqual({
            id:1,
            issueDate:"2021/11/29 09:33",
            state: "ACCEPTED",
            products: [{"SKUId":12,"description":"a product","price":10.99,"qty":2},
                        {"SKUId":180,"description":"another product","price":11.99,"qty":3}],
            customerId : 13
        });
    });
});

describe("create an internalOrder", () => {
    test("create an internalOrder", async () => {
        const internalOrder = {
            issueDate:"2021/11/29 09:33",
            products: [{"SKUId":12,"description":"a product","price":10.99,"qty":2},
                        {"SKUId":180,"description":"another product","price":11.99,"qty":3}],
            customerId : 13
        };
        await internalOrderService.createInternalOrder(internalOrder);
        expect(internalOrderDAO.createInternalOrder.mock.calls[0][0].issueDate).toBe(internalOrder.issueDate);
        expect(internalOrderDAO.createInternalOrder.mock.calls[0][0].products).toBe(internalOrder.products);
        expect(internalOrderDAO.createInternalOrder.mock.calls[0][0].customerId).toBe(internalOrder.customerId);
    });
});

describe("modify an internalOrder with state ACCEPTED", () => {
    test("modify an internalOrder with state ACCEPTED", async () => {
        const id = 1;
        const newStatus = {newState: "ACCEPTED"};
        await internalOrderService.changeStateInternalOrder(id, newStatus);
        expect(internalOrderDAO.changeStateInternalOrder.mock.calls[0][0]).toBe(id);
        expect(internalOrderDAO.changeStateInternalOrder.mock.calls[0][1].newState).toBe(newStatus.newState);
    });
});

describe("modify an internalOrder with state COMPLETED and products arrary", () => {
    test("modify an internalOrder with state COMPLETED and products arrary", async () => {
        const id = 1;
        const products = [{"SKUId":12,"description":"a product","price":10.99,"qty":2},
            {"SKUId":180,"description":"another product","price":11.99,"qty":3}];
        const newStatus = {newState: "COMPLETED", products: products};
        await internalOrderService.changeStateInternalOrder(id, newStatus);
        expect(internalOrderDAO.changeStateInternalOrder.mock.calls[0][0]).toBe(id);
        expect(internalOrderDAO.changeStateInternalOrder.mock.calls[0][1].newState).toBe(newStatus.newState);
        expect(internalOrderDAO.changeStateInternalOrder.mock.calls[0][1].products).toBe(newStatus.products);
    });
});

describe("modify an internalOrder with state ACCEPTED and products arrary (the products array should be ignored)", () => {
    test("modify an internalOrder with state ACCEPTED and products arrary (the products array should be ignored)", async () => {
        const id = 1;
        const products = [{"SKUId":12,"description":"a product","price":10.99,"qty":2},
            {"SKUId":180,"description":"another product","price":11.99,"qty":3}];
        const newStatus = {newState: "ACCEPTED", products: products};
        await internalOrderService.changeStateInternalOrder(id, newStatus);
        expect(internalOrderDAO.changeStateInternalOrder.mock.calls[0][0]).toBe(id);
        expect(internalOrderDAO.changeStateInternalOrder.mock.calls[0][1].newState).toBe(newStatus.newState);
        expect(internalOrderDAO.changeStateInternalOrder.mock.calls[0][1].products).toBe(newStatus.products);
    });
});

describe("delete an internalOrder", () => {
    test("delete an internalOrder", async () => {
        const id = 1;
        await internalOrderService.deleteInternalOrder(id);
        expect(internalOrderDAO.deleteInternalOrder.mock.calls[0][0]).toBe(id);
    });
});
