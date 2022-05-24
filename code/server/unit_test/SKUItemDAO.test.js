const SKUItemDAO = require('../modules/SKUItemDAO');

describe('testSKUItemDao', () => {
    beforeEach(async () => {
        await SKUItemDAO.deleteSKUItems();
    });

    test('delete all SKUItems', async () => {
        var res = await SKUItemDAO.getAllSKUItems();
        expect(res.length).toStrictEqual(0);
    });

    testAddSKUItem_getAllSKUItems_getSKUItem('123123123', ['123123123', 1, 10, '2021/11/29 12:30']);
    testModifySKUItem('123123123', ['123123123', 1, 10, '2021/11/29 12:30'], ['321321', 1, '2021/11/22 12:30']);
    testDeleteSKUItem('123123123', ['123123123', 1, 10, '2021/11/29 12:30']);

});

function testAddSKUItem_getAllSKUItems_getSKUItem(RFID, SKUItem) {
    test('create new SKUItem and get all SKUItems and get an SKUItem by rfid', async () => {
        await SKUItemDAO.addSKUItem(SKUItem);
        var res = await SKUItemDAO.getAllSKUItems();
        expect(res.length).toStrictEqual(1);
        res = await SKUItemDAO.getSKUItem(RFID);
        expect(res.RFID).toStrictEqual(RFID);
        expect(res.SKUId).toStrictEqual(SKUItem.SKUId);
        expect(res.available).toStrictEqual(SKU.available);
        expect(res.dateOfStock).toStrictEqual(SKU.dateOfStock);
    });
}

function testModifySKUItem(RFID, SKUItem, newStatus){
    test("modify an SKUItem", async () => {
        await SKUItemDAO.addSKUItem(SKUItem);
        await SKUItemDAO.modifySKUItem(RFID, newStatus) ;
        var res = await SKUItemDAO.getSKUItem(RFID);
        expect(res.length).toStrictEqual(1);
        expect(res.RFID).toStrictEqual(newStatus.newRFID);
        expect(res.available).toStrictEqual(newStatus.newAvailable);
        expect(res.dateOfStock).toStrictEqual(newStatus.newDateOfStock);
    });
}

function testDeleteSKUItem(RFID, SKUItem){
    test("delete an SKUItem", async () => {
        await SKUItemDAO.addSKUItem(SKUItem);
        await SKUItemDAO.deleteSKUItem(RFID);   
        var res = await SKUItemDAO.getSKUItem(RFID);
        expect(res).toEqual("404");
    });
}