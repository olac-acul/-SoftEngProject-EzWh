const ItemService = require("../modules/services/itemService");
const itemDAO = require("../modules/DAOs/itemDAO");
const itemService = new ItemService(itemDAO);

describe("get items", () => {
    beforeEach(async () => {
        await itemDAO.deleteItems();
        await itemDAO.createItem({id: 12, description: "d1", price: 10.99, SKUId: 8, supplierId: 10});
    });
    testGetItems();
    testGetItemById();
});

async function testGetItems(){
    test("get items", async () => {
        let res = await itemService.getItems();
        expect(res[0]).toEqual({
            id:12,
            description : "d1",
            price : 10.99,
            SKUId : 8,
            supplierId : 10
        });
    });
}

async function testGetItemById(){
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
}

describe("create an item", () => {
    beforeEach(async () => {
        await itemDAO.deleteItems();
    });
    testCreateItem();
});

async function testCreateItem(){
    test("create an item", async () => {
        const item = {
            id:12,
            description : "d1",
            price : 10.99,
            SKUId : 8,
            supplierId : 10
        }
        let res = await itemService.createItem(item);
        res = await itemService.getItemById(item.id);
        expect(res).toEqual({
            id:12,
            description : "d1",
            price : 10.99,
            SKUId : 8,
            supplierId : 10
        });
    });
}

describe("modify an item", () => {
    beforeEach(async () => {
        await itemDAO.deleteItems();
        await itemDAO.createItem({id: 12, description: "d1", price: 10.99, SKUId: 8, supplierId: 10});
    });
    testModifyItem();
});

async function testModifyItem(){
    test("modify an item", async () => {
        const id = 12;
        const newStatus = {
            newDescription: "d2",
            newPrice: 9.99
        };
        let res = await itemService.modifyItem(id, newStatus);
        res = await itemService.getItemById(id);
        expect(res).toEqual({
            id:12,
            description : "d2",
            price : 9.99,
            SKUId : 8,
            supplierId : 10
        });
    });
}

describe("delete an item", () => {
    beforeEach(async () => {
        await itemDAO.deleteItems();
        await itemDAO.createItem({id: 12, description: "d1", price: 10.99, SKUId: 8, supplierId: 10});
    });
    testDeleteItem();
});

async function testDeleteItem(){
    test("delete an item", async () => {
        const id = 12;
        let res = await itemService.deleteItem(id);
        res = await itemService.getItemById(id);
        expect(res).toEqual("404");
    });
}