const dayjs = require('dayjs');
dayjs().format();
const availableStates = ['ISSUED', 'DELIVERY', 'DELIVERED', 'TESTED', 'COMPLETED', 'COMPLETEDRETURN'];
class RestockOrderService {
    dao;

    constructor(dao) {
        this.dao = dao;
    }

    getRestockOrders = async () => {
        // 401 Unauthorized (not logged in or wrong permissions)
        const restockOrders = [];
        const orders = await this.dao.getRestockOrders();
        for (let i of orders) {
            let restockOrder = await this.dao.getRestockOrderById(i.id);
            restockOrders.push(restockOrder);
        }
        return restockOrders;
    }

    getRestockOrderById = async (id) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        if (isNaN(id) || Number(id) <= 0)
            return '422';
        const validatedId = Number(id);
        const restockOrder = await this.dao.getRestockOrderById(validatedId);
        if (restockOrder === '404')
            return '404';
        if (restockOrder.state === 'ISSUED') {
            return {
                id: validatedId,
                issueDate: restockOrder.issueDate,
                state: restockOrder.state,
                products: restockOrder.products,
                supplierId: restockOrder.supplierId,
                skuItems: restockOrder.skuItems
            };
        }
        else {
            return {
                id: validatedId,
                issueDate: restockOrder.issueDate,
                state: restockOrder.state,
                products: restockOrder.products,
                supplierId: restockOrder.supplierId,
                transportNote: restockOrder.transportNote,
                skuItems: restockOrder.skuItems
            };
        }
    }

    getSKUItemsToBeReturned = async (id) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        if (isNaN(id) || Number(id) <= 0)
            return '422';
        const validatedId = Number(id);
        const restockOrder = await this.dao.getRestockOrderById(validatedId);
        if (restockOrder === '404')
            return '404';
        if (restockOrder.state !== 'COMPLETEDRETURN')
            return '422';
        const skuItems = restockOrder.skuItems;
        const skuItemsToBeReturned = [];
        for (let item of skuItems) {
            if (await this.dao.checkTestResult(item))
                skuItemsToBeReturned.push(item);
        }
        return skuItemsToBeReturned;
    }

    createRestockOrder = async (RestockOrder) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        if (Object.keys(RestockOrder).length !== 3)
            return '422';
        if (RestockOrder.issueDate === undefined || RestockOrder.products === undefined || RestockOrder.supplierId === undefined)
            return '422';
        if (!dayjs(RestockOrder.issueDate).isValid() || RestockOrder.issueDate.length !== 16)
            return '422';
        if (RestockOrder.products.length == 0)
            return '422';
        for (let i of RestockOrder.products) {
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
        if (typeof RestockOrder.supplierId != "number" || RestockOrder.supplierId <= 0)
            return '422';
        const validatedRestockOrder = {
            issueDate: RestockOrder.issueDate,
            products: RestockOrder.products,
            supplierId: RestockOrder.supplierId
        };
        await this.dao.newRestockOrderTable();
        await this.dao.newRestockOrder_join_ProductTable();
        const restockOrderId = await this.dao.createRestockOrder(validatedRestockOrder);
        for (let product of validatedRestockOrder.products) {
            const itemId = await this.dao.getItemBySKUId(product.SKUId, validatedRestockOrder.supplierId);
            if (itemId !== undefined)
                await this.dao.createRestockOrder_join_Product(restockOrderId, itemId, product.qty);
        }
    }

    changeStateRestockOrder = async (id, newState) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        if (isNaN(id) || Number(id) <= 0)
            return '422';
        const validatedId = Number(id);
        if (Object.keys(newState).length !== 1)
            return '422';
        if (newState.newState === undefined)
            return '422';
        if (!availableStates.includes(newState.newState))
            return '422';
        const validatedNewState = newState.newState;
        const updatedElements = await this.dao.changeStateRestockOrder(validatedId, validatedNewState);
        if (updatedElements === 0)
            return '404';
    }

    addSkuItemsList = async (id, skuItems) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        if (isNaN(id) || Number(id) <= 0)
            return '422';
        const validatedId = Number(id);
        if (Object.keys(skuItems).length !== 1)
            return '422';
        if (skuItems.skuItems === undefined)
            return '422';
        if (skuItems.skuItems.length === 0)
            return '422';
        for (let i of skuItems.skuItems) {
            if (Object.keys(i).length !== 2)
                return '422';
            if (i.SKUId === undefined || i.rfid === undefined)
                return '422';
            if (typeof i.SKUId != "number" || i.SKUId <= 0)
                return '422';
            if (isNaN(i.rfid) || i.rfid.length !== 32)
                return '422';
        }
        const validatedSKUItems = skuItems.skuItems;
        const restockOrder = await this.dao.getRestockOrderById(validatedId);
        if (restockOrder === '404')
            return '404';
        if (restockOrder.state !== 'DELIVERED')
            return '422';
        const productsSKUIds = restockOrder.products.map(p => p.SKUId);
        for (let i of validatedSKUItems) {
            if (!productsSKUIds.includes(i.SKUId))
                return '422';
        }
        for (let i of validatedSKUItems) {
            if (await this.dao.getSKUItem(i.rfid) === '404')
                await this.dao.addSKUItem(i.rfid, i.SKUId);
        }
    }

    addTransportNoteRestockOrder = async (id, transportNote) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        if (isNaN(id) || Number(id) <= 0)
            return '422';
        const validatedId = Number(id);
        if (Object.keys(transportNote).length !== 1)
            return '422';
        if (transportNote.transportNote === undefined)
            return '422';
        if (Object.keys(transportNote.transportNote).length !== 1)
            return '422';
        if (transportNote.transportNote.deliveryDate === undefined)
            return '422';
        if (!dayjs(transportNote.transportNote.deliveryDate).isValid() || transportNote.transportNote.deliveryDate.length !== 10)
            return '422';
        const validatedDeliveryDate = transportNote.transportNote.deliveryDate;
        const restockOrder = await this.dao.getRestockOrderById(validatedId);
        if (restockOrder === '404')
            return '404';
        if (restockOrder.state !== 'DELIVERY')
            return '422';
        if (dayjs(validatedDeliveryDate).isBefore(dayjs(restockOrder.issueDate)))
            return '422';
        await this.dao.addTransportNoteRestockOrder(validatedId, validatedDeliveryDate);
    }

    deleteRestockOrder = async (id) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        if (isNaN(id) || Number(id) <= 0)
            return '422';
        const validatedId = Number(id);
        const deletedElements = await this.dao.deleteRestockOrder(validatedId);
        if (deletedElements === 0)
            return '422';
        await this.dao.deleteRestockOrder_join_Product(validatedId);
    }
}

module.exports = RestockOrderService;