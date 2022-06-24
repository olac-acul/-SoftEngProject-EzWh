class ItemService {
    dao;

    constructor(dao) {
        this.dao = dao;
    }

    getItems = async () => {
        // 401 Unauthorized (not logged in or wrong permissions)
        const items = await this.dao.getItems();
        return items;
    }

    getItemById = async (id, supplierId) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        if (isNaN(id) || Number(id) < 0)
            return '422';
        if (isNaN(supplierId) || Number(supplierId) < 0)
            return '422';
        const validatedId = Number(id);
        const validatedSupplierId = Number(supplierId);
        const item = await this.dao.getItemById(validatedId, validatedSupplierId);
        if (item === '404')
            return '404';
        else
            return item;
    }

    createItem = async (item) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        if (Object.keys(item).length !== 5)
            return '422';
        if (item.id === undefined || item.description === undefined || item.price === undefined || item.SKUId === undefined || item.supplierId === undefined)
            return '422';
        if (typeof item.id != "number" || item.id < 0)
            return '422';
        if (typeof item.description != "string")
            return '422';
        if (typeof item.price != "number" || item.price <= 0)
            return '422';
        if (typeof item.SKUId != "number" || item.SKUId < 0)
            return '422';
        if (typeof item.supplierId != "number" || item.supplierId < 0)
            return '422';
        const validatedItem = {
            id: item.id,
            description: item.description,
            price: item.price,
            SKUId: item.SKUId,
            supplierId: item.supplierId
        };
        let status = await this.dao.getItemById_supplier(validatedItem.id, validatedItem.supplierId);
        if (status !== '404')
            return '422';
        // status = await this.dao.validateSKUId(validatedItem.SKUId, validatedItem.supplierId);
        // if (status === false)
        //     return '422';
        status = await this.dao.searchSKU(validatedItem.SKUId);
        if (status === false)
            return '404';
        await this.dao.newTable();
        await this.dao.createItem(validatedItem);
        return;
    }

    modifyItem = async (id, supplierId, newStatus) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        if (isNaN(id) || Number(id) < 0)
            return '422';
        if (isNaN(supplierId) || Number(supplierId) < 0)
            return '422';
        const validatedId = Number(id);
        const validatedSupplierId = Number(supplierId);
        if (Object.keys(newStatus).length !== 2)
            return '422';
        if (newStatus.newDescription === undefined || newStatus.newPrice === undefined)
            return '422';
        if (typeof newStatus.newDescription != "string")
            return '422';
        if (typeof newStatus.newPrice != "number" || newStatus.newPrice <= 0)
            return '422';
        const validatedNewStatus = {
            newDescription: newStatus.newDescription,
            newPrice: newStatus.newPrice
        };
        const updatedElements = await this.dao.modifyItem(validatedId, validatedSupplierId, validatedNewStatus);
        if (updatedElements === 0)
            return '404';
        return;
    }

    deleteItem = async (id, supplierId) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        if (isNaN(id) || Number(id) < 0)
            return '422';
        if (isNaN(supplierId) || Number(supplierId) < 0)
            return '422';
        const validatedId = Number(id);
        const validatedSupplierId = Number(supplierId);
        await this.dao.deleteItem(validatedId, validatedSupplierId);
        return;
    }

    deleteItems = async () => {
        await this.dao.deleteItems();
    }
}
module.exports = ItemService;