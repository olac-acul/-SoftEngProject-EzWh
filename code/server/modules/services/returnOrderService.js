class ReturnOrderService {
    dao;

    constructor(dao) {
        this.dao = dao;
    }

    getReturnOrders = async () => {
        const orders = await this.dao.getReturnOrders();
        return orders;
    }

    getReturnOrderById = async (id) => {
        const returnOrder = await this.dao.getReturnOrderById(id);
        return returnOrder;
    }

    getRestockOrderById = async (id) => {
        const restockOrder = await this.dao.getRestockOrderById(id);
        return restockOrder;
    }

    createReturnOrder = async (returnOrder) => {
        await this.dao.newReturnOrderTable();
        await this.dao.createReturnOrder(returnOrder);
    }

    createReturnOrder_join_Product = async (SKUId, returnOrderId) => {
        await this.dao.newReturnOrder_join_ProductTable();
        await this.dao.createReturnOrder_join_Product(SKUId, returnOrderId);
    }

    deleteReturnOrder = async (id) => {
        const deletedElements = await this.dao.deleteReturnOrder(id);
        return deletedElements;
    }

    deleteReturnOrder_join_Product = async (id) => {
        await this.dao.deleteReturnOrder_join_Product(id);
    }
}

module.exports = ReturnOrderService;