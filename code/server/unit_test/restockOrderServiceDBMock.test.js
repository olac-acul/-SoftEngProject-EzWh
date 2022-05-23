const RestockOrderService = require("../services/restockOrderService");
const restockOrderDAO = require("../mockDAOs/mockRestockOrderDAO");
const restockOrderService = new RestockOrderService(restockOrderDAO);

describe("get restockOrders", () => {
    restockOrderDAO.getRestockOrders.mockReturnValue(  {
        id:1,
        issueDate:"2021/11/29 09:33",
        state: "ISSUED",
        supplierId : 1,
        transportNote: null
        }
  );
    test("get restockOrders", async () => {
        let res = await restockOrderService.getRestockOrders();
        expect(res).toEqual({
            id:1,
            issueDate:"2021/11/29 09:33",
            state: "ISSUED",
            supplierId : 1,
            transportNote: null
        });
    });
});

describe("get a restockOrder", () => {
    restockOrderDAO.getRestockOrderById.mockReturnValue({
        id:1,
        issueDate:"2021/11/29 09:33",
        state: "ISSUED",
        supplierId : 1,
        transportNote: null
    });
    test("get a restockOrder", async () => {
        const id = 1;
        let res = await restockOrderService.getRestockOrderById(id);
        expect(res).toEqual({
            id:1,
            issueDate:"2021/11/29 09:33",
            state: "ISSUED",
            supplierId : 1,
            transportNote: null
        });
    });
});

describe("create a restockOrder", () => {
    test("create a restockOrder", async () => {
        const restockOrder = {
            issueDate:"2021/11/29 09:33",
            supplierId : 1,
        };
        await restockOrderService.createRestockOrder(restockOrder);
        expect(restockOrderDAO.createRestockOrder.mock.call).toBe(restockOrder);
    });
});

describe("change a restockOrder state", () => {
    test("change a restockOrder state", async () => {
        const id = 1;
        const newState = "DELIVERED";
        await restockOrderService.changeStateRestockOrder(id, newState);
        expect(restockOrderDAO.changeStateRestockOrder.mock.calls[0]).toBe(id);
        expect(restockOrderDAO.changeStateRestockOrder.calls[1]).toBe(newState);
    });
});

describe("add a transportNote to a restockOrder", () => {
    test("add a transportNote to a restockOrder", async () => {
        const id = 1;
        const transportNote = {deliveryDate:"2021/12/29"};
        await restockOrderService.addTransportNoteRestockOrder(id, transportNote);
        expect(restockOrderDAO.addTransportNoteRestockOrder.mock.calls[0]).toBe(id);
        expect(restockOrderDAO.addTransportNoteRestockOrder.calls[1]).toBe(transportNote.deliveryDate);
    });
});

describe("delete a restockOrder", () => {
    test("delete a restockOrder", async () => {
        const id = 1;
        await restockOrderService.deleteRestockOrder(id);
        expect(restockOrderDAO.deleteRestockOrder.mock.call).toBe(id);
    });
});
