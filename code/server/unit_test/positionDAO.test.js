const positionDAO = require('../modules/positionDAO');

describe('testPositionDAO', () => {
    beforeEach(async () => {
        await positionDAO.deletePositions();
    });

    test('delete all positions', async () => {
        var res = await positionDAO.getPositions();
        expect(res.length).toStrictEqual(0);
    });

    testCreatePositionAndGetPositions("800234543412", "8002", "3454", "3412", 1000, 1000);
    testModifyPosition("800234543412", "800234543412", "8002", "3454", "3412", 1000, 1000, "801234543412", "8012", "3454", "3412", 1000, 1000, 350, 150);
    testChangePositionId("800234543412", "8002", "3454", "3412", 1000, 1000, "8012", "3454", "3412", "801234543412");
    testDeletePosition("801234543412", "8012", "3454", "3412", 1000, 1000);
});

function testCreatePositionAndGetPositions(positionID, aisleID, row, col, maxWeight, maxVolume) {
    test('create new position and get all positions', async () => {
        await positionDAO.createPosition({positionID: positionID, aisleID: aisleID, row: row, col: col, maxWeight: maxWeight, maxVolume: maxVolume});
        var res = await positionDAO.getPositions();
        expect(res.length).toStrictEqual(1);
        expect(res.positionID).toStrictEqual(positionID);
        expect(res.aisleID).toStrictEqual(aisleID);
        expect(res.row).toStrictEqual(row);
        expect(res.col).toStrictEqual(col);
        expect(res.maxWeight).toStrictEqual(maxWeight);
        expect(res.maxVolume).toStrictEqual(maxVolume);
    });
}

function testModifyPosition(oldPositionID, aisleID, row, col,maxWeight, maxVolume, newPositionID, newAisleID, newRow, newCol, newMaxWeight, newMaxVolume, newOccupiedWeight, newOccupiedVolume){
    test("modify a position", async () => {
        await positionDAO.createPosition({positionID: oldPositionID, aisleID: aisleID, row: row, col: col, maxWeight: maxWeight, maxVolume: maxVolume});
        await positionDAO.modifyPosition(oldPositionID, newPositionID, {newAisleID: newAisleID, newRow: newRow, newCol: newCol, newMaxWeight: newMaxWeight, newMaxVolume: newMaxVolume, newOccupiedWeight: newOccupiedWeight, newOccupiedVolume: newOccupiedVolume});   
        var res = await positionDAO.getPositions();
        expect(res.length).toStrictEqual(1);
        expect(res.positionID).toStrictEqual(newPositionID);
        expect(res.aisleID).toStrictEqual(newAisleID);
        expect(res.row).toStrictEqual(newRow);
        expect(res.col).toStrictEqual(newCol);
        expect(res.maxWeight).toStrictEqual(newMaxWeight);
        expect(res.maxVolume).toStrictEqual(newMaxVolume);
        expect(res.occupiedWeight).toStrictEqual(newOccupiedWeight);
        expect(res.occupiedVolume).toStrictEqual(newOccupiedVolume);
    });
}

function testChangePositionId(oldPositionID, aisleID, row, col, maxWeight, maxVolume, newAisleID, newRow, newCol, newPositionID){
    test("change positionID", async () => {
        await positionDAO.createPosition({positionID: oldPositionID, aisleID: aisleID, row: row, col: col, maxWeight: maxWeight, maxVolume: maxVolume});
        await positionDAO.changePositionId(oldPositionID, newAisleID, newRow, newCol, newPositionID);   
        var res = await positionDAO.getPositions();
        expect(res.length).toStrictEqual(1);
        expect(res.positionID).toStrictEqual(newPositionID);
        expect(res.aisleID).toStrictEqual(newAisleID);
        expect(res.row).toStrictEqual(newRow);
        expect(res.col).toStrictEqual(newCol);
        expect(res.maxWeight).toStrictEqual(maxWeight);
        expect(res.maxVolume).toStrictEqual(maxVolume);
    });
}

function testDeletePosition(positionID, aisleID, row, col, maxWeight, maxVolume){
    test("delete a position", async () => {
        await positionDAO.createPosition({positionID: positionID, aisleID: aisleID, row: row, col: col, maxWeight: maxWeight, maxVolume: maxVolume});
        await positionDAO.deletePosition(positionID);   
        var res = await positionDAO.getPositions();
        expect(res).toEqual("404");
    });
}
