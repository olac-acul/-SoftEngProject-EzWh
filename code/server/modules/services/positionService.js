class PositionService {
    dao;

    constructor(dao) {
        this.dao = dao;
    }

    getPositions = async () => {
        // 401 Unauthorized (not logged in or wrong permissions)
        const positions = await this.dao.getPositions();
        return positions;
    }

    createPosition = async (position) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        if (Object.keys(position).length !== 6)
            return '422';
        if (position.positionID === undefined || position.aisleID === undefined || position.row === undefined || position.col === undefined || position.maxWeight === undefined || position.maxVolume === undefined)
            return '422';
        if (position.aisleID.length !== 4 || position.row.length !== 4 || position.col.length !== 4)
            return '422';
        if (typeof position.maxWeight !== "number" || typeof position.maxVolume !== "number")
            return '422';
        if (position.positionID !== position.aisleID + position.row + position.col)
            return '422';
        // END OF VALIDATION
        await this.dao.newTable();
        await this.dao.createPosition(position);
        return '201';
    }

    modifyPosition = async (oldPositionID, position) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        if (Object.keys(position).length !== 7)
            return '422';
        if (position.newAisleID === undefined || position.newRow === undefined || position.newCol === undefined || position.newMaxWeight === undefined || position.newMaxVolume === undefined || position.newOccupiedWeight === undefined || position.newOccupiedVolume === undefined)
            return '422';
        if (position.newAisleID.length !== 4 || position.newRow.length !== 4 || position.newCol.length !== 4)
            return '422';
        if (typeof position.newMaxWeight !== "number" || typeof position.newMaxVolume !== "number" || typeof position.newOccupiedWeight !== "number" || typeof position.newOccupiedVolume !== "number")
            return '422';
        if (oldPositionID.length !== 12)
            return '422';
        // END OF VALIDATION
        const newPositionID = position.newAisleID + position.newRow + position.newCol;
        const updatedElements = await this.dao.modifyPosition(oldPositionID, newPositionID, position);
        if (updatedElements === 0)
            return '404';
        else
            return '200';
    }

    changePositionId = async (oldPositionId, newPositionId) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        if (Object.keys(newPositionId).length !== 1)
            return '422';
        if (newPositionId.newPositionID === undefined)
            return '422';
        if (newPositionId.newPositionID.length !== 12)
            return '422';
        if (oldPositionId.length !== 12)
            return '422';
        // END OF VALIDATION
        const newPositionID = newPositionId.newPositionID;
        const newAisleID = newPositionId.newPositionID.slice(0, 4);
        const newRow = newPositionId.newPositionID.slice(4, 8);
        const newCol = newPositionId.newPositionID.slice(8, 12);
        const updatedElements = await this.dao.changePositionId(oldPositionId, newAisleID, newRow, newCol, newPositionID);
        if (updatedElements === 0)
            return '404';
        else
            return '200';
    }

    deletePosition = async (id) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        if (id.length !== 12)
            return '422';
        // END OF VALIDATION
        const deletedElements = await this.dao.deletePosition(id);
        if (deletedElements === 0)
            return '404';
        else
            return '204';
    }
}

module.exports = PositionService;