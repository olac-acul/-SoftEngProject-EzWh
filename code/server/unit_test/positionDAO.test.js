const positionDAO = require('../modules/positionDAO');

describe('testPositionDao', () => {
    beforeEach(async () => {
        await positionDAO.deletePositions();
    });

    test('delete all positions', async () => {
        var res = await positionDAO.getPositions();
        expect(res.length).toStrictEqual(0);
    });

    testCreatePositionAndGetPositions("800234543412", "8002", "3454", "3412", 1000, 1000)
    testDeletePosition("801234543412", "8012", "3454", "3412", 1000, 1000);
});

function testCreatePositionAndGetPositions(positionID, aisleID, row, col, maxWeight, maxVolume) {
    test('create new position', async () => {
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

function testDeletePosition(positionID, aisleID, row, col, maxWeight, maxVolume){
    test("delete a position", async () => {
        await positionDAO.createPosition(positionID, aisleID, row, col, maxWeight, maxVolume);
        await positionDAO.deletePosition(positionID);   
        var res = await positionDAO.getPositions();
        expect(res.length).toStrictEqual(0);
    });
}
