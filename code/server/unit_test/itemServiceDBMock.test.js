const ItemService = require("../modules/services/itemService");
const itemDAO = require("../modules/mockDAOs/mockItemDAO");
const itemService = new ItemService(itemDAO);

describe("get items", () => {
    itemDAO.getItems.mockReturnValue(  {
        id:12,
        description : "d1",
        price : 10.99,
        SKUId : 8,
        supplierId : 10
    }
  );
    test("get items", async () => {
        let res = await itemService.getItems();
        expect(res).toEqual({
            id:12,
            description : "d1",
            price : 10.99,
            SKUId : 8,
            supplierId : 10
        });
    });
});

describe("get an Item", () => {
    itemDAO.getItemById.mockReturnValue({
        id:12,
        description : "d1",
        price : 10.99,
        SKUId : 8,
        supplierId : 10
    });
    test("get an item", async () => {
        const id = 12;
        let res = await itemService.getItemById(id);
        expect(res).toEqual({
            id:12,
            description : "d1",
            price : 10.99,
            SKUId : 8,
            supplierId : 10
        });
    });
});

describe("create an item", () => {
    test("create an item", async () => {
        const item = {
            id:12,
            description : "d1",
            price : 10.99,
            SKUId : 8,
            supplierId : 10
        };
        await itemService.createItem(item);
        expect(itemDAO.createItem.mock.calls[0][0].id).toBe(item.id);
        expect(itemDAO.createItem.mock.calls[0][0].description).toBe(item.description);
        expect(itemDAO.createItem.mock.calls[0][0].price).toBe(item.price);
        expect(itemDAO.createItem.mock.calls[0][0].SKUId).toBe(item.SKUId);
        expect(itemDAO.createItem.mock.calls[0][0].supplierId).toBe(item.supplierId);
    });
});

describe("modify an item", () => {
    test("modify an item", async () => {
        const id = 12;
        const newStatus = {
            newDescription: "d2",
            newPrice: 9.99
        };
        await itemService.modifyItem(id, newStatus);
        expect(itemDAO.modifyItem.mock.calls[0][0]).toBe(id);
        expect(itemDAO.modifyItem.mock.calls[0][1].newDescription).toBe(newStatus.newDescription);
        expect(itemDAO.modifyItem.mock.calls[0][1].newPrice).toBe(newStatus.newPrice);
    });
});

describe("delete an item", () => {
    test("delete an item", async () => {
        const id = 12;
        await itemService.deleteItem(id);
        expect(itemDAO.deleteItem.mock.calls[0][0]).toBe(id);
    });
});
