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
        if (isNaN(id) || Number(id) < 0)
            return '422';
        const validatedId = Number(id);
        const SKU = await this.dao.getSKU(validatedId);
        return SKU;
    }

    addSKU = async (SKU) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        if (Object.keys(SKU).length !== 6)
            return '422';
        if (SKU.description === undefined || SKU.weight === undefined || SKU.volume === undefined || SKU.notes === undefined || SKU.price === undefined || SKU.availableQuantity === undefined)
            return '422';
        if (typeof SKU.description != "string" || SKU.description.length === 0)
            return '422';
        if (typeof SKU.weight != "number" || SKU.weight <= 0 || !Number.isInteger(SKU.weight))
            return '422';
        if (typeof SKU.volume != "number" || SKU.volume <= 0 || !Number.isInteger(SKU.volume))
            return '422';
        if (typeof SKU.notes != "string" || SKU.notes.length === 0)
            return '422';
        if (typeof SKU.price != "number" || SKU.price <= 0)
            return '422';
        if (typeof SKU.availableQuantity != "number" || SKU.availableQuantity <= 0 || !Number.isInteger(SKU.availableQuantity))
            return '422';
        const validatedSKU = {
            description: SKU.description,
            weight: SKU.weight,
            volume: SKU.volume,
            notes: SKU.notes,
            price: SKU.price,
            availableQuantity: SKU.availableQuantity
        }
        await this.dao.newSKUTable();
        const status = await this.dao.addSKU(validatedSKU);
        return status;
    }

    modifySKU = async (id, newState) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        if (isNaN(id) || Number(id) < 0)
            return '422';
        const validatedId = Number(id);
        if (Object.keys(newState).length !== 6)
            return '422';
        if (newState.newDescription === undefined || newState.newWeight === undefined || newState.newVolume === undefined || newState.newNotes === undefined || newState.newPrice === undefined || newState.newAvailableQuantity === undefined)
            return '422';
        if (typeof newState.newDescription != "string")
            return '422';
        if (typeof newState.newWeight != "number" || newState.newWeight <= 0)
            return '422';
        if (typeof newState.newVolume != "number" || newState.newVolume <= 0)
            return '422';
        if (typeof newState.newNotes != "string")
            return '422';
        if (typeof newState.newPrice != "number" || newState.newPrice <= 0)
            return '422';
        if (typeof newState.newAvailableQuantity != "number" || newState.newAvailableQuantity <= 0)
            return '422';
        const validatedNewState = {
            newDescription: newState.newDescription,
            newWeight: newState.newWeight,
            newVolume: newState.newVolume,
            newNotes: newState.newNotes,
            newPrice: newState.newPrice,
            newAvailableQuantity: newState.newAvailableQuantity
        }
        // const skuPosition = await this.dao.getSKUPosition(validatedId);
        // if (skuPosition === '422')
        //     return '422';
        // if (skuPosition !== '404') {
        //     const position = await this.dao.getPositionById(skuPosition);
        //     if (validatedNewState.newWeight <= position.maxWeight && validatedNewState.newVolume <= position.maxVolume) {
        //         await this.dao.modifyPositionWeightVolume(skuPosition, validatedNewState.newWeight, validatedNewState.newVolume);
        //     }
        //     else {
        //         return '422';
        //     }
        // }
        // else if (skuPosition === '404')
        //     return '404';
        const updatedElements = await this.dao.modifySKU(validatedId, validatedNewState);
        if (updatedElements === 0)
            return '404';
    }

    modifySKUPosition = async (id, newPosition) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        if (isNaN(id) || Number(id) < 0)
            return '422';
        const validatedId = Number(id);
        if (Object.keys(newPosition).length !== 1)
            return '422';
        if (newPosition.position === undefined)
            return '422';
        if (isNaN(newPosition.position) || newPosition.position.length !== 12)
            return '422';
        const validatedNewPosition = newPosition.position;
        // check if the new position is already assigned to another SKU
        const SKUs = await this.dao.getAllSKUs();
        const filteredSKUs = SKUs.filter(sku => sku.id !== validatedId && sku.position === validatedNewPosition);
        if (filteredSKUs.length !== 0)
            return '422';
        // return position object corresponding to the new position
        const newPositionLimitation = await this.dao.getPositionById(validatedNewPosition);
        // check if the new position does not exist
        if (newPositionLimitation === '404')
            return '404';
        // check if the new position available space is not sufficient
        const SKU = await this.dao.getSKU(validatedId);
        if (SKU.weight > newPositionLimitation.maxWeight || SKU.volume > newPositionLimitation.maxVolume)
            return '422';
        // return id of the old position of the SKU
        const oldSKUPositionId = await this.dao.getSKUPosition(validatedId);
        if (oldSKUPositionId === '422') {
            // old position is null
            await this.dao.modifyPositionWeightVolume(validatedNewPosition, SKU.weight, SKU.volume);
            await this.dao.modifySKUPosition(validatedId, validatedNewPosition);
        }
        else if (oldSKUPositionId === '404')
            // SKU id does not exist 
            return '404';
        else {
            // SKU has already a position
            await this.dao.modifyPositionWeightVolume(oldSKUPositionId, 0, 0);
            await this.dao.modifyPositionWeightVolume(validatedNewPosition, SKU.weight, SKU.volume);
            await this.dao.modifySKUPosition(validatedId, validatedNewPosition);
        }
    }

    deleteSKU = async (id) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        if (isNaN(id) || Number(id) < 0)
            return '422';
        const validatedId = Number(id);
        await this.dao.deleteSKU(validatedId);
    }

    deleteSKUs = async () => {
        await this.dao.deleteSKUs();
    }
}

module.exports = SKUService;