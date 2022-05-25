const SKUItemService = require("../modules/services/SKUItemService");
const SKUItemDAO = require("../modules/mockDAOs/mockSKUItemDAO");
const SKUItem_Service = new SKUItemService(SKUItemDAO);

describe("get SKUItems", () => {
    SKUItemDAO.getAllSKUItems.mockReturnValue(  {
        RFID: '123123123',
        SKUId: 1,
        available: 10,
        dateOfStock: '2021/11/29 12:30'
    }
  );
    test("get SKUItems", async () => {
        let res = await SKUItem_Service.getSKUItems();
        expect(res).toEqual({
            RFID: '123123123',
            SKUId: 1,
            available: 10,
            dateOfStock: '2021/11/29 12:30'
        });
    });
});

describe("get an SKUItem", () => {
    SKUItemDAO.getSKUItem.mockReturnValue({
        RFID: '123123123',
        SKUId: 1,
        available: 10,
        dateOfStock: '2021/11/29 12:30'
    });
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
});

describe("create an SKUItem", () => {
    test("create an SKUItem", async () => {
        const SKUItem = {
            RFID: '123123123',
            SKUId: 1,
            available: 10,
            dateOfStock: '2021/11/29 12:30'
        };
        await SKUItem_Service.addSKUItem(SKUItem);
        expect(SKUItemDAO.addSKUItem.mock.calls[0][0].RFID).toBe(SKUItem.RFID);
        expect(SKUItemDAO.addSKUItem.mock.calls[0][0].SKUId).toBe(SKUItem.SKUId);
        expect(SKUItemDAO.addSKUItem.mock.calls[0][0].available).toBe(SKUItem.available);
        expect(SKUItemDAO.addSKUItem.mock.calls[0][0].dateOfStock).toBe(SKUItem.dateOfStock);
    });
});

describe("modify an SKUItem", () => {
    test("modify an SKUItem", async () => {
        const RFID = '123123123';
        const newStatus = {
            newRFID: "321321",
            newAvailable: 1,
            newDateOfStock: "2021/11/22 12:30"
        };
        await SKU_Service.modifySKU(RFID, newStatus);
        expect(SKUItemDAO.modifySKUItem.mock.calls[0][0]).toBe(RFID);
        expect(SKUItemDAO.modifySKUItem.mock.calls[0][1].newRFID).toBe(newStatus.newRFID);
        expect(SKUItemDAO.modifySKUItem.mock.calls[0][1].newAvailable).toBe(newStatus.newAvailable);
        expect(SKUItemDAO.modifySKUItem.mock.calls[0][1].newDateOfStock).toBe(newStatus.newDateOfStock);
    });
});

describe("delete an SKUItem", () => {
    test("delete an SKUItem", async () => {
        const RFID = '123123123';
        await SKUItem_Service.deleteSKUItem(RFID);
        expect(SKUItemDAO.deleteSKUItem.mock.calls[0][0]).toBe(RFID);
    });
});
