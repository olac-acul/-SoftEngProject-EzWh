const dayjs = require('dayjs');
dayjs().format();
const availableStates = ['ISSUED', 'ACCEPTED', 'REFUSED', 'CANCELED', 'COMPLETED'];
class InternalOrderService {
    dao;

    constructor(dao) {
        this.dao = dao;
    }

    getInternalOrders = async () => {
        // 401 Unauthorized (not logged in or wrong permissions)
        const internalOrders = [];
        const orders = await this.dao.getInternalOrders();
        for (let i of orders) {
            let internalOrder = await this.dao.getInternalOrderById(i.id);
            internalOrders.push(internalOrder);
        }
        return internalOrders;
    }

    getInternalOrderById = async (id) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        if (isNaN(id) || Number(id) <= 0)
            return '422';
        const validatedId = Number(id);
        const order = await this.dao.getInternalOrderById(validatedId);
        if (order === '404')
            return '404';
        return order;
    }

    createInternalOrder = async (intOrd) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        if (Object.keys(intOrd).length !== 3)
            return '422';
        if (intOrd.issueDate === undefined || intOrd.products === undefined || intOrd.customerId === undefined)
            return '422';
        if (!dayjs(intOrd.issueDate).isValid() || (intOrd.issueDate !== 10 && intOrd.issueDate.length !== 16))
            return '422';
        if (intOrd.products.length == 0)
            return '422';
        for (let i of intOrd.products) {
            if (Object.keys(i).length !== 4)
                return '422';
            if (i.SKUId === undefined || i.description === undefined || i.price === undefined || i.qty === undefined)
                return '422';
            if (typeof i.SKUId != "number" || i.SKUId <= 0)
                return '422';
            if (typeof i.description != "string")
                return '422';
            if (typeof i.price != "number" || i.price <= 0)
                return '422';
            if (typeof i.qty != "number" || i.qty <= 0)
                return '422';
        }
        if (typeof intOrd.customerId != "number" || intOrd.customerId <= 0)
            return '422';
        const internalOrder = {
            issueDate: intOrd.issueDate,
            products: intOrd.products,
            customerId: intOrd.customerId
        };
        await this.dao.newInternalOrdersTable();
        await this.dao.newInternalOrder_join_productTable();
        const lastId = await this.dao.createInternalOrder(internalOrder);
        for (let i of internalOrder.products) {
            await this.dao.createInternalOrder_join_Product(lastId, i.SKUId, i.qty);
        }
    }

    changeStateInternalOrder = async (id, newState) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        if (isNaN(id) || Number(id) <= 0)
            return '422';
        const validatedId = Number(id);
        if ((Object.keys(newState).length === 1 || (Object.keys(newState).length === 2 && newState.products !== undefined)) && newState.newState !== 'COMPLETED' && availableStates.includes(newState.newState)) {
            const status = await this.dao.changeStateInternalOrder(validatedId, newState.newState);
            if (status === 0)
                return '404';
        }
        else if (Object.keys(newState).length === 2 && newState.newState === 'COMPLETED' && newState.products !== undefined) {
            for (let i of newState.products) {
                if (Object.keys(i).length !== 2)
                    return '422';
                if (i.SkuID === undefined || i.RFID === undefined)
                    return '422';
                if (typeof i.SkuID != "number" || i.SkuID <= 0)
                    return '422';
                if (isNaN(i.RFID) || i.RFID.length !== 32)
                    return '422';
            }
            const status = await this.dao.changeStateInternalOrder(validatedId, 'COMPLETED');
            if (status === 0)
                return '404';
            await this.dao.newSKUItemTable();
            for (let i of newState.products) {
                await this.dao.addSKUItem(i.SkuID, i.RFID);
            }
        }
        else
            return '422';
    }

    deleteInternalOrder = async (id) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        if (isNaN(id) || Number(id) <= 0)
            return '422';
        const validatedId = Number(id);
        await this.dao.deleteInternalOrder(validatedId);
        await this.dao.deleteInternalOrder_join_Product(validatedId);
    }

    deleteInternalOrders = async () => {
        await this.dao.deleteInternalOrders();
    }
}

module.exports = InternalOrderService;