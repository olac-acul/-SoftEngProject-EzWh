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
        const item = await this.dao.getItemById(id);
        return item;
    }

    createItem = async (item) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        await this.dao.newTable();
        const status = await this.dao.createItem(item);
        return status;
    }

    deleteItem = async (id) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        const deletedElelements = await this.dao.deleteItem(id);
        return deletedElelements;
    }
}
module.exports = ItemService;