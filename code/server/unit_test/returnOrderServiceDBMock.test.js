const ReturnOrderService = require("../modules/services/returnOrderService");
const returnOrderDAO = require("../modules/mockDAOs/mockReturnOrderDAO");
const returnOrderService = new ReturnOrderService(returnOrderDAO);

describe("get returnOrders", () => {
    returnOrderDAO.getReturnOrders.mockReturnValue(  [{
        id: 1,
        returnDate: "2021/11/29 09:33",
        restockOrderId : 1
        }]
  );
    test("get returnOrders", async () => {
        let res = await returnOrderService.getReturnOrders();
        expect(res).toEqual([{
            id: 1,
            returnDate: "2021/11/29 09:33",
            restockOrderId : 1
        }]);
    });
});

describe("get a returnOrder", () => {
    returnOrderDAO.getReturnOrderById.mockReturnValue({
        id:1,
        returnDate: "2021/11/29 09:33",
        restockOrderId : 1
    });
    test("get a returnOrder", async () => {
        const id = 1;
        let res = await returnOrderService.getReturnOrderById(id);
        expect(res).toEqual({
            returnDate: "2021/11/29 09:33",
            restockOrderId : 1
        });
    });
});

describe("create a returnOrder", () => {
    test("create a returnOrder", async () => {
        const returnOrder = {
            returnDate: "2021/11/29 09:33",
            products: [],
            restockOrderId : 1
        };
        await returnOrderService.createReturnOrder(returnOrder);
        expect(returnOrderDAO.createReturnOrder.mock.calls[0][0].returnDate).toBe(returnOrder.returnDate);
        expect(returnOrderDAO.createReturnOrder.mock.calls[0][0].restockOrderId).toBe(returnOrder.restockOrderId);
    });
});

describe("delete a returnOrder", () => {
    test("delete a returnOrder", async () => {
        const id = 1;
        await returnOrderService.deleteReturnOrder(id);
        expect(returnOrderDAO.deleteReturnOrder.mock.calls[0][0]).toBe(id);
    });
});