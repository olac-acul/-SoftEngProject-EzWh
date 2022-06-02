const dayjs = require('dayjs');
dayjs().format();
class SKUItemService {
    dao;

    constructor(dao) {
        this.dao = dao;
    }

    getAllSKUItems = async () => {
        // 401 Unauthorized (not logged in or wrong permissions)
        const SKUItems = await this.dao.getAllSKUItems();
        return SKUItems;
    }

    getAllAvailableSKUItems = async (id) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        if (isNaN(id))
            return '422';
        if (Number(id) <= 0)
            return '422';
        const validatedId = Number(id);
        const SKUItems = await this.dao.getAllAvailableSKUItems(validatedId);
        if (SKUItems === '404')
            return '404';
        else
            return SKUItems;
    }

    getSKUItem = async (RFID) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        if (isNaN(RFID))
            return '422';
        if (RFID.length !== 32)
            return '422';
        const validatedRFID = RFID;
        const SKUItem = await this.dao.getSKUItem(validatedRFID);
        if (SKUItem === '404')
            return '404';
        else
            return SKUItem;
    }

    addSKUItem = async (SKUItem) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        if (Object.keys(SKUItem).length !== 3)
            return '422';
        if (SKUItem.RFID === undefined || SKUItem.SKUId === undefined || SKUItem.DateOfStock === undefined)
            return '422';
        if (SKUItem.RFID === null || isNaN(SKUItem.RFID) || SKUItem.RFID.length !== 32)
            return '422';
        if (SKUItem.SKUId === null || typeof SKUItem.SKUId != "number" || SKUItem.SKUId <= 0)
            return '422';
        if (SKUItem.DateOfStock !== null) {
            if (!dayjs(SKUItem.DateOfStock).isValid() || (SKUItem.DateOfStock.length !== 10 && SKUItem.DateOfStock.length !== 16))
                return '422';
        }
        const validatedSKUItem = {
            RFID: SKUItem.RFID,
            SKUId: SKUItem.SKUId,
            DateOfStock: SKUItem.DateOfStock
        };
        const status = await this.dao.searchSKU(validatedSKUItem.SKUId);
        if (status === false)
            return '404';
        await this.dao.newSKUItemTable();
        await this.dao.addSKUItem(validatedSKUItem);
        return;
    }

    modifySKUItem = async (oldRFID, newStatus) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        if (isNaN(oldRFID) || oldRFID.length !== 32)
            return '422';
        if (Object.keys(newStatus).length !== 3)
            return '422';
        if (newStatus.newRFID === undefined || newStatus.newAvailable === undefined || newStatus.newDateOfStock === undefined)
            return '422';
        if (isNaN(newStatus.newRFID) || newStatus.newRFID.length !== 32)
            return '422';
        if (newStatus.newAvailable !== 0 && newStatus.newAvailable !== 1)
            return '422';
        if (newStatus.newDateOfStock !== null) {
            if (!dayjs(newStatus.newDateOfStock).isValid() || (newStatus.newDateOfStock.length !== 10 && newStatus.newDateOfStock.length !== 16))
                return '422';
        }
        const validatedNewStatus = {
            newRFID: newStatus.newRFID,
            newAvailable: newStatus.newAvailable,
            newDateOfStock: newStatus.newDateOfStock
        };
        const updatedElements = await this.dao.modifySKUItem(oldRFID, validatedNewStatus);
        return updatedElements;
    }

    deleteSKUItem = async (RFID) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        if (isNaN(RFID) || RFID.length !== 32)
            return '422';
        const validatedRFID = RFID;
        await this.dao.deleteSKUItem(validatedRFID);
    }

    deleteSKUItems = async () => {
        await this.dao.deleteSKUItems();
        }
}

module.exports = SKUItemService;