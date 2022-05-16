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

    getItemById = async (id) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        if (isNaN(id))
            return '422';
        if (Number(id) <= 0)
            return '422';
        const validatedId = Number(id);
        const item = await this.dao.getItemById(validatedId);
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
        if (typeof item.id != "number" || item.id <= 0)
            return '422';
        if (typeof item.description != "string")
            return '422';
        if (typeof item.price != "number" || item.price <= 0)
            return '422';
        if (typeof item.SKUId != "number" || item.SKUId <= 0)
            return '422';
        if (typeof item.supplierId != "number" || item.supplierId <= 0)
            return '422';
        const validatedItem = {
            id: item.id,
            description: item.description,
            price: item.price,
            SKUId: item.SKUId,
            supplierId: item.supplierId
        };
        let status = await this.dao.getItemById(validatedItem.id);
        if (status !== '404')
            return '422';
        status = await this.dao.validateSKUId(validatedItem.SKUId, validatedItem.supplierId);
        if (status === false)
            return '422';
        status = await this.dao.searchSKU(validatedItem.SKUId);
        if (status === false)
            return '404';
        await this.dao.newTable();
        await this.dao.createItem(validatedItem);
        return;
    }

    modifyItem = async (id, newStatus) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        if (isNaN(id))
            return '422';
        if (Number(id) <= 0)
            return '422';
        const validatedId = Number(id);
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
        const updatedElements = await this.dao.modifyItem(validatedId, validatedNewStatus);
        if (updatedElements === 0)
            return '404';
        return;
    }

    deleteItem = async (id) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        if (isNaN(id))
            return '422';
        if (Number(id) <= 0)
            return '422';
        const validatedId = Number(id);
        const deletedElelements = await this.dao.deleteItem(validatedId);
        if (deletedElelements === 0)
            return '422';
        return;
    }
}
module.exports = ItemService;