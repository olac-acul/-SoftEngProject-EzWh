class RestockOrderService {
    dao;

    constructor(dao) {
        this.dao = dao;
    }

    getRestockOrders = async () => {
        // 401 Unauthorized (not logged in or wrong permissions)
        const orders = await this.dao.getRestockOrders();
        return orders;
    }

    getRestockOrdersIssued = async () => {
        // 401 Unauthorized (not logged in or wrong permissions)
        const orders = await this.dao.getRestockOrdersIssued();
        return orders;
    }

    getRestockOrderById = async (id) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        const RestockOrder = await this.dao.getRestockOrderById(id);
        return RestockOrder;
    }

    createRestockOrder = async (RestockOrder) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        await this.dao.newRestockOrderTable();
        await this.dao.newRestockOrder_join_ProductTable();
        const RestockOrderId = await this.dao.createRestockOrder(RestockOrder);
        return RestockOrderId;
    }

    createRestockOrder_join_Product = async (SKUId, RestockOrderId) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        await this.dao.createRestockOrder_join_Product(SKUId, RestockOrderId);
    }

    changeStateRestockOrder = async (id, newState) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        await this.dao.changeStateRestockOrder(id, newState);
    }

    addSkuItemsList = async (skuItems, id) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        await this.dao.addSkuItemsList(skuItems, id);
    }

    getInternalRestockById = async (id) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        const order = await this.dao.getInternalRestockById(id);
        return order;
    }

    addTransportNoteRestockOrder = async (id, transportNote) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        await this.dao.addTransportNoteRestockOrder(id, transportNote);
    }

    deleteRestockOrder = async (id) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        const deletedElelements = await this.dao.deleteRestockOrder(id);
        return deletedElelements;
    }

    deleteRestockOrderJoinSkuItems = async (id) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        const deletedJoin1 = await this.dao.deleteRestockOrderJoinSkuItems(id);
        return deletedJoin1;
    }

    deleteRestockOrderJoinItems = async (id) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        const deletedJoins = await this.dao.deleteRestockOrderJoinItems(id);
        return deletedJoins;
    }

}

module.exports = RestockOrderService;