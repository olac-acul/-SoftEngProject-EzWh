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
        const SKUItems = await this.dao.getAllAvailableSKUItems(id);
        return SKUItems;
    }

    getSKUItem = async (RFID) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        const SKUItem = await this.dao.getSKUItem(RFID);
        return SKUItem;
    }

    addSKUItem = async (SKUItem) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        await this.dao.newSKUItemTable();
        const status = await this.dao.addSKUItem(SKUItem);
        return status;
    }

    modifySKUItem = async (oldRFID, newRFID, newAvailable, newDateOfStock) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        const updatedElements = await this.dao.modifySKUItem(oldRFID, newRFID, newAvailable, newDateOfStock);
        return updatedElements;
    }

    deleteSKUItem = async (RFID) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        const deletedSKUItems = await this.dao.deleteSKUItem(RFID);
        return deletedSKUItems;
    }
}

module.exports = SKUItemService;