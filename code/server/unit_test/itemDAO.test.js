const itemDAO = require('../modules/DAOs/itemDAO');

describe('testItemDAO', () => {
    beforeEach(async () => {
        await itemDAO.deleteItems();
    });

    test('delete all items', async () => {
        var res = await itemDAO.getItems();
        expect(res.length).toStrictEqual(0);
    });

    testCreateItem_And_GetItems_And_GetItemById({id: 12, description: "d1", price: 10.99, SKUId: 8, supplierId: 10});
    testModifyItem({id: 12, description: "d1", price: 10.99, SKUId: 8, supplierId: 10}, {newDescription: "d2", newPrice: 9.99});
    testDeleteItem({id: 12, description: "d1", price: 10.99, SKUId: 8, supplierId: 10});
});

function testCreateItem_And_GetItems_And_GetItemById(item) {
    test('create new item and get all items and get an item by id', async () => {
        await itemDAO.createItem(item);
        var res = await itemDAO.getItems();
        expect(res.length).toStrictEqual(1);
        res = await itemDAO.getItemById(item.id);
        expect(res.id).toStrictEqual(item.id);
        expect(res.description).toStrictEqual(item.description);
        expect(res.price).toStrictEqual(item.price);
        expect(res.SKUId).toStrictEqual(item.SKUId);
        expect(res.supplierId).toStrictEqual(item.supplierId);
    });
}

function testModifyItem(item, newStatus){
    test("modify an item", async () => {
        await itemDAO.createItem(item);
        await itemDAO.modifyItem(item.id, newStatus);   
        var res = await itemDAO.getItemById(item.id);
        expect(res.id).toStrictEqual(item.id);
        expect(res.description).toStrictEqual(newStatus.newDescription);
        expect(res.price).toStrictEqual(newStatus.newPrice);
        expect(res.SKUId).toStrictEqual(item.SKUId);
        expect(res.supplierId).toStrictEqual(item.supplierId);
    });
}

function testDeleteItem(item){
    test("delete an item", async () => {
        await itemDAO.createItem(item);
        await itemDAO.deleteItem(item.id);   
        var res = await itemDAO.getItemById(item.id);
        expect(res).toEqual("404");
    });
}
