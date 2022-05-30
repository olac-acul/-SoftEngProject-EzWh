const RestockOrderService = require("../modules/services/restockOrderService");
const restockOrderDAO = require("../modules/mockDAOs/mockRestockOrderDAO");
const restockOrderService = new RestockOrderService(restockOrderDAO);

// describe("get restockOrders", () => {
//     restockOrderDAO.getRestockOrders.mockReturnValue(  [{
//         id:1,
//         issueDate:"2021/11/29 09:33",
//         state: "ISSUED",
//         supplierId : 8
//         },{
//             id:2,
//             issueDate:"2021/11/22 09:33",
//             state: "ISSUED",
//             supplierId : 10
//             }
//         ]
        
//   );
//     test("get restockOrders", async () => {
//         let res = await restockOrderService.getRestockOrders();
//         expect(res).toEqual([{
//             id:1,
//             issueDate:"2021/11/29 09:33",
//             state: "ISSUED",
//             supplierId : 8
//         }, {
//             id:2,
//             issueDate:"2021/11/22 09:33",
//             state: "ISSUED",
//             supplierId : 10
//         }]);
//     });
// });

describe("get a restockOrder", () => {
    restockOrderDAO.getRestockOrderById.mockReturnValue({
        id:1,
        issueDate:"2021/11/29 09:33",
        state: "ISSUED",
        products: [{"SKUId":12,"description":"a product","price":10.99,"qty":30},
                    {"SKUId":180,"description":"another product","price":11.99,"qty":20}],
        supplierId : 8,
        skuItems: null
    });
    test("get a restockOrder", async () => {
        const id = 1;
        let res = await restockOrderService.getRestockOrderById(id);
        expect(res).toEqual({
            id:1,
            issueDate:"2021/11/29 09:33",
            state: "ISSUED",
            products: [{"SKUId":12,"description":"a product","price":10.99,"qty":30},
                        {"SKUId":180,"description":"another product","price":11.99,"qty":20}],
            supplierId : 8,
            skuItems: null
        });
    });
});

describe("create a restockOrder", () => {
    test("create a restockOrder", async () => {
        const restockOrder = {
            issueDate:"2021/11/29 09:33",
            products: [{"SKUId":12,"description":"a product","price":10.99,"qty":30},
                        {"SKUId":180,"description":"another product","price":11.99,"qty":20}],
            supplierId : 8,
        };
        await restockOrderService.createRestockOrder(restockOrder);
        expect(restockOrderDAO.createRestockOrder.mock.calls[0][0].issueDate).toBe(restockOrder.issueDate);
        expect(restockOrderDAO.createRestockOrder.mock.calls[0][0].products).toBe(restockOrder.products);
        expect(restockOrderDAO.createRestockOrder.mock.calls[0][0].supplierId).toBe(restockOrder.supplierId);
    });
});

describe("change a restockOrder state", () => {
    test("change a restockOrder state", async () => {
        const id = 1;
        const newState = "DELIVERED";
        await restockOrderService.changeStateRestockOrder(id, newState);
        expect(restockOrderDAO.changeStateRestockOrder.mock.calls[0][0].id).toBe(id);
        expect(restockOrderDAO.changeStateRestockOrder.calls[0][1].newState).toBe(newState);
    });
});

describe("add a transportNote to a restockOrder", () => {
    test("add a transportNote to a restockOrder", async () => {
        const id = 1;
        const transportNote = {deliveryDate:"2021/12/29"};
        await restockOrderService.addTransportNoteRestockOrder(id, transportNote);
        expect(restockOrderDAO.addTransportNoteRestockOrder.mock.calls[0][0]).toBe(id);
        expect(restockOrderDAO.addTransportNoteRestockOrder.calls[0][1].deliveryDate).toBe(transportNote.deliveryDate);
    });
});

describe("delete a restockOrder", () => {
    test("delete a restockOrder", async () => {
        const id = 1;
        await restockOrderService.deleteRestockOrder(id);
        expect(restockOrderDAO.deleteRestockOrder.mock.calls[0][0]).toBe(id);
    });
});
