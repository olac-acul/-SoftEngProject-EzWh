class SKUService {
    dao;

    constructor(dao) {
        this.dao = dao;
    }

    getAllSKUs = async () => {
        // 401 Unauthorized (not logged in or wrong permissions)
        const SKUs = await this.dao.getAllSKUs();
        return SKUs;
    }

    getSKU = async (id) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        const SKU = await this.dao.getSKU(id);
        return SKU;
    }

    addSKU = async (SKU) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        await this.dao.newSKUTable();
        const status = await this.dao.addSKU(SKU);
        return status;
    }

    deleteSKU = async (id) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        const deletedSKUs = await this.dao.deleteSKU(id);
        return deletedSKUs;
    }
}

module.exports = SKUService;