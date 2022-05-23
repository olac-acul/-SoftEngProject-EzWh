const itemDAO = require('../modules/itemDAO');

describe('testItemDAO', () => {
    beforeEach(async () => {
        await itemDAO.deleteItems();
    });

    test('delete all items', async () => {
        var res = await itemDAO.getItems();
        expect(res.length).toStrictEqual(0);
    });

    testCreateItem_And_GetItems_And_GetItemById(12, "d1", 10.99, 8, 10);
    testModifyItem(12, "d1", 10.99, 8, 10, "d2", 9.99);
    testDeleteItem(12, "d1", 10.99, 8, 10);
});

function testCreateItem_And_GetItems_And_GetItemById(id, description, price, SKUId, supplierId) {
    test('create new item and get all items and get an item by id', async () => {
        await itemDAO.createItem([id, description, price, SKUId, supplierId]);
        var res = await itemDAO.getItems();
        expect(res.length).toStrictEqual(1);
        res = await itemDAO.getItemById(id);
        expect(res.id).toStrictEqual(id);
        expect(res.description).toStrictEqual(description);
        expect(res.price).toStrictEqual(price);
        expect(res.SKUId).toStrictEqual(SKUId);
        expect(res.supplierId).toStrictEqual(supplierId);
    });
}

function testModifyItem(id, description, price, SKUId, supplierId, newDescription, newPrice){
    test("modify an item", async () => {
        await itemDAO.createItem([id, description, price, SKUId, supplierId]);
        await itemDAO.modifyItem(id, [newDescription, newPrice]);   
        var res = await itemDAO.getItemById(id);
        expect(res.length).toStrictEqual(1);
        expect(res.id).toStrictEqual(id);
        expect(res.description).toStrictEqual(newDescription);
        expect(res.price).toStrictEqual(newPrice);
        expect(res.SKUId).toStrictEqual(SKUId);
        expect(res.supplierId).toStrictEqual(supplierId);
    });
}

function testDeleteItem(id, description, price, SKUId, supplierId, newDescription, newPrice){
    test("delete an item", async () => {
        await itemDAO.createItem([id, description, price, SKUId, supplierId, newDescription, newPrice]);
        await itemDAO.deleteItem(id);   
        var res = await itemDAO.getItemById(id);
        expect(res).toEqual("404");
    });
}
