class InternalOrderService {
    dao;

    constructor(dao) {
        this.dao = dao;
    }

    getInternalOrder = async () => {
        // 401 Unauthorized (not logged in or wrong permissions)
        const internalOrders = await this.dao.getInternalOrder();
        return internalOrders;
    }

    getInternalOrderById = async (id) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        const order = await this.dao.getInternalOrderById(id);
        return order;
    }

    createInternalOrder = async (intOrd) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        await this.dao.createInternalOrder(intOrd);
    }

    changeStateInternalOrder = async (newState, id) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        await this.dao.changeStateInternalOrder(newState, id);
    }

    createJoinProduct = async (product) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        await this.dao.createJoinProduct(product);
    }

    deleteInternalOrder = async (id) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        const deletedElelements = await this.dao.deleteInternalOrder(id);
        return deletedElelements;
    }

    deleteJoinProduct = async (id) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        const deletedElelements = await this.dao.deleteJoinProduct(id);
        return deletedElelements;
    }
}

module.exports = InternalOrderService;