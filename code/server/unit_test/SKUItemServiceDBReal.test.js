const SKUItemService = require("../modules/services/SKUItemService");
const SKUItemDAO = require("../modules/DAOs/SKUItemDAO");
const SKUItem_Service = new SKUItemService(SKUItemDAO);

describe("get SKUItems", () => {
    beforeEach(async () => {
        await SKUItemDAO.dropTable();
        await SKUItemDAO.newSKUItemTable();
        await SKUItemDAO.addSKUItem({RFID: '123123123', SKUId: 8, DateOfStock: '2021/11/29 12:30'});
    });
    testGetSKUItems();
    testGetSKUItem();
});

async function testGetSKUItems(){
    test("get SKUItems", async () => {
        let res = await SKUItem_Service.getSKUItems();
        expect(res).toEqual({
            RFID: '123123123',
            SKUId: 1,
            available: 10,
            dateOfStock: '2021/11/29 12:30'
        });
    });
}

async function testGetSKUItem(){
    test("get an SKUItem", async () => {
        const RFID = '123123123';
        let res = await SKUItem_Service.getSKUItem(RFID);
        expect(res).toEqual({
            RFID: '123123123',
            SKUId: 1,
            available: 10,
            dateOfStock: '2021/11/29 12:30'
        });
    });
}

describe("create an SKUItem", () => {
    beforeEach(async () => {
        await SKUItemDAO.dropTable();
        await SKUItemDAO.newSKUItemTable();
    });
    testAddSKUItem();
});

async function testAddSKUItem(){
    test("create an SKUItem", async () => {
        const RFID = '123123123';
        const SKUItem = {
            RFID: '123123123',
            SKUId: 1,
            available: 10,
            dateOfStock: '2021/11/29 12:30'
        }
        let res = await SKUItem_Service.addSKUItem(SKUItem);
        res = await SKUItem_Service.getSKUItem(RFID);
        expect(res).toEqual({
            RFID: '123123123',
            SKUId: 1,
            available: 10,
            dateOfStock: '2021/11/29 12:30'
        });
    });
}

describe("modify an SKUItem", () => {
    beforeEach(async () => {
        await SKUItemDAO.dropTable();
        await SKUItemDAO.newSKUItemTable();
        await SKUItemDAO.addSKUItem({RFID: '123123123', SKUId: 8, DateOfStock: '2021/11/29 12:30'});
    });
    testModifySKUItem();
});

async function testModifySKUItem(){
    test("modify an SKUItem", async () => {
        const RFID = '123123123';
        const newStatus = {
            newRFID: "321321",
            newAvailable: 1,
            newDateOfStock: "2021/11/22 12:30"
        };
        let res = await SKUItem_Service.modifySKUItem(RFID, newStatus);
        res = await SKUItem_Service.getSKUItem(RFID);
        expect(res).toEqual({
            RFID: '321321',
            SKUId: 1,
            available: 1,
            dateOfStock: '2021/11/22 12:30'
        });
    });
}

describe("delete an SKUItem", () => {
    beforeEach(async () => {
        await SKUItemDAO.dropTable();
        await SKUItemDAO.newSKUItemTable();
        await SKUItemDAO.addSKUItem({RFID: '123123123', SKUId: 8, DateOfStock: '2021/11/29 12:30'});
    });
    testDeleteSKUItem();
});

async function testDeleteSKUItem(){
    test("delete an SKUItem", async () => {
        const RFID = '123123123';
        let res = await SKUItem_Service.deleteSKUItem(RFID);
        res = await SKUItem_Service.getSKUItem(RFID);
        expect(res).toEqual("404");
    });
}