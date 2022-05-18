const positionDAO = require('../modules/positionDAO');

describe('testPositionDao', () => {
    beforeEach(async () => {
        await positionDAO.deletePositions();
    });

    test('delete all positions', async () => {
        var res = await positionDAO.getPositions();
        expect(res.length).toStrictEqual(0);
    });

    testCreatePositionAndGetPositions("800234543412", "8002", "3454", "3412", 1000, 1000);
    testModifyPosition("800234543412", ["8002", "3454", "3412", 1000, 1000], "801234543412", ["8012", "3454", "3412", 1000, 1000, 350, 150]);
    testUpdatePosition("800234543412", ["8002", "3454", "3412", 1000, 1000], 350, 150);
    testChangePositionId("800234543412", ["8002", "3454", "3412", 1000, 1000], "8012", "3454", "3412", "801234543412");
    testDeletePosition("801234543412", "8012", "3454", "3412", 1000, 1000);
});

function testCreatePositionAndGetPositions(positionID, aisleID, row, col, maxWeight, maxVolume) {
    test('create new position and get all positions', async () => {
        await positionDAO.createPosition(positionID, aisleID, row, col, maxWeight, maxVolume);
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

function testModifyPosition(oldPositionID, oldPosition, newPositionID, newPosition){
    test("modify a position", async () => {
        await positionDAO.createPosition(oldPositionID, oldPosition.aisleID, oldPosition.row, oldPosition.col, oldPosition.maxWeight, oldPosition.maxVolume);
        await positionDAO.modifyPosition(oldPositionID, newPositionID, newPosition);   
        var res = await positionDAO.getPositions();
        expect(res.length).toStrictEqual(1);
        expect(res.positionID).toStrictEqual(newPositionID);
        expect(res.aisleID).toStrictEqual(newPosition.aisleID);
        expect(res.row).toStrictEqual(newPosition.row);
        expect(res.col).toStrictEqual(newPosition.col);
        expect(res.maxWeight).toStrictEqual(newPosition.maxWeight);
        expect(res.maxVolume).toStrictEqual(newPosition.maxVolume);
        expect(res.occupiedWeight).toStrictEqual(newPosition.occupiedWeight);
        expect(res.occupiedVolume).toStrictEqual(newPosition.occupiedVolume);
    });
}

function testUpdatePosition(positionID, position, newOccupiedWeight, newOccupiedVolume){
    test("update a position", async () => {
        await positionDAO.createPosition(positionID, position.aisleID, position.row, position.col, position.maxWeight, position.maxVolume);
        await positionDAO.updatePosition(positionID, newOccupiedWeight, newOccupiedVolume);   
        var res = await positionDAO.getPositions();
        expect(res.length).toStrictEqual(1);
        expect(res.positionID).toStrictEqual(positionID);
        expect(res.aisleID).toStrictEqual(position.aisleID);
        expect(res.row).toStrictEqual(position.row);
        expect(res.col).toStrictEqual(position.col);
        expect(res.maxWeight).toStrictEqual(position.maxWeight);
        expect(res.maxVolume).toStrictEqual(position.maxVolume);
        expect(res.occupiedWeight).toStrictEqual(newOccupiedWeight);
        expect(res.occupiedVolume).toStrictEqual(newOccupiedVolume);
    });
}

function testChangePositionId(oldPositionId, oldPosition, newAisleID, newRow, newCol, newPositionID){
    test("change positionID", async () => {
        await positionDAO.createPosition(oldPositionID, oldPosition.aisleID, oldPosition.row, oldPosition.col, oldPosition.maxWeight, oldPosition.maxVolume);
        await positionDAO.changePositionId(oldPositionID, newAisleID, newRow, newCol, newPositionID);   
        var res = await positionDAO.getPositions();
        expect(res.length).toStrictEqual(1);
        expect(res.positionID).toStrictEqual(newPositionID);
        expect(res.aisleID).toStrictEqual(newPosition.aisleID);
        expect(res.row).toStrictEqual(newPosition.row);
        expect(res.col).toStrictEqual(newPosition.col);
        expect(res.maxWeight).toStrictEqual(oldPosition.maxWeight);
        expect(res.maxVolume).toStrictEqual(oldPosition.maxVolume);
        expect(res.occupiedWeight).toStrictEqual(oldPosition.occupiedWeight);
        expect(res.occupiedVolume).toStrictEqual(oldPosition.occupiedVolume);
    });
}

function testDeletePosition(positionID, aisleID, row, col, maxWeight, maxVolume){
    test("delete a position", async () => {
        await positionDAO.createPosition(positionID, aisleID, row, col, maxWeight, maxVolume);
        await positionDAO.deletePosition(positionID);   
        var res = await positionDAO.getPositions();
        expect(res.length).toStrictEqual(0);
    });
}
