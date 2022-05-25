const SKUItemDAO = require('../modules/DAOs/SKUItemDAO');

describe('testSKUItemDAO', () => {
    beforeEach(async () => {
        await SKUItemDAO.dropTable();
        await SKUItemDAO.newSKUItemTable();
    });

    test('delete all SKUItems', async () => {
        var res = await SKUItemDAO.getAllSKUItems();
        expect(res.length).toStrictEqual(0);
    });

    testAddSKUItem_getAllSKUItems_getSKUItem({RFID: '123123123', SKUId: 8, DateOfStock: '2021/11/29 12:30'});
    testModifySKUItem({RFID: '123123123', SKUId: 8, DateOfStock: '2021/11/29 12:30'}, {newRFID: '321321321', newAvailable: 1 , newDateOfStock: '2021/11/22 12:30'});
    testDeleteSKUItem({RFID: '123123123', SKUId: 8, DateOfStock: '2021/11/29 12:30'});

});

function testAddSKUItem_getAllSKUItems_getSKUItem(SKUItem) {
    test('create new SKUItem and get all SKUItems and get an SKUItem by rfid', async () => {
        await SKUItemDAO.addSKUItem(SKUItem);
        var res = await SKUItemDAO.getAllSKUItems();
        expect(res.length).toStrictEqual(1);
        res = await SKUItemDAO.getSKUItem(SKUItem.RFID);
        expect(res.RFID).toStrictEqual(SKUItem.RFID);
        expect(res.SKUId).toStrictEqual(SKUItem.SKUId);
        expect(res.available).toStrictEqual(0);
        expect(res.dateOfStock).toStrictEqual(SKUItem.dateOfStock);
    });
}

function testModifySKUItem(SKUItem, newStatus){
    test("modify an SKUItem", async () => {
        await SKUItemDAO.addSKUItem(SKUItem);
        await SKUItemDAO.modifySKUItem(SKUItem.RFID, newStatus) ;
        var res = await SKUItemDAO.getSKUItem(SKUItem.RFID);
        expect(res.length).toStrictEqual(3);
        expect(res.RFID).toStrictEqual(newStatus.newRFID);
        expect(res.available).toStrictEqual(newStatus.newAvailable);
        expect(res.dateOfStock).toStrictEqual(newStatus.newDateOfStock);
    });
}

function testDeleteSKUItem(SKUItem){
    test("delete an SKUItem", async () => {
        await SKUItemDAO.addSKUItem(SKUItem);
        await SKUItemDAO.deleteSKUItem(SKUItem.RFID);   
        var res = await SKUItemDAO.getSKUItem(SKUItem.RFID);
        expect(res).toEqual("404");
    });
}