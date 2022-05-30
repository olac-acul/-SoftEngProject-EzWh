const PositionService = require("../modules/services/positionService");
const positionDAO = require("../modules/DAOs/positionDAO");
const positionService = new PositionService(positionDAO);

describe("get positions", () => {
    beforeEach(async () => {
        await positionDAO.deletePositions();
        await positionDAO.createPosition({positionID: "800234543412", aisleID: "8002", row: "3454", col: "3412", maxWeight: 1000, maxVolume: 1000});
    });
    testGetPositions();
});

async function testGetPositions(){
    test("get positions", async () => {
        let res = await positionService.getPositions();
        expect(res[0]).toEqual({
            positionID: "800234543412",
            aisleID: "8002",
            row: "3454",
            col: "3412",
            maxWeight: 1000,
            maxVolume: 1000,
            occupiedWeight: 0,
            occupiedVolume: 0
        });
    });
}

describe("create a position", () => {
    beforeEach(async () => {
        await positionDAO.deletePositions();
    });
    testCreatePosition();
});

async function testCreatePosition(){
    test("create a position", async () => {
        const position = {
            positionID: "800234543412",
            aisleID: "8002",
            row: "3454",
            col: "3412",
            maxWeight: 1000,
            maxVolume: 1000
        }
        let res = await positionService.createPosition(position);
        res = await positionService.getPositions();
        expect(res[0]).toEqual({
            positionID: "800234543412",
            aisleID: "8002",
            row: "3454",
            col: "3412",
            maxWeight: 1000,
            maxVolume: 1000,
            occupiedWeight: 0,
            occupiedVolume: 0
        });
    });
}

describe("modify a position", () => {
    beforeEach(async () => {
        await positionDAO.deletePositions();
        await positionDAO.createPosition({positionID: "800234543412", aisleID: "8002", row: "3454", col: "3412", maxWeight: 1000, maxVolume: 1000});
    });
    testModifyPosition();
});

async function testModifyPosition(){
    test("modify a position", async () => {
        const oldPositionID = "800234543412";
        const position = {
            newAisleID: "8012",
            newRow: "3454",
            newCol: "3412",
            newMaxWeight: 1000,
            newMaxVolume: 1000,
            newOccupiedWeight: 300,
            newOccupiedVolume: 150
        }
        let res = await positionService.modifyPosition(oldPositionID, position);
        res = await positionService.getPositions();
        expect(res[0]).toEqual({
            positionID: "801234543412",
            aisleID: "8012",
            row: "3454",
            col: "3412",
            maxWeight: 1000,
            maxVolume: 1000,
            occupiedWeight: 300,
            occupiedVolume: 150
        });
    });
}

describe("change positionID", () => {
    beforeEach(async () => {
        await positionDAO.deletePositions();
        await positionDAO.createPosition({positionID: "800234543412", aisleID: "8002", row: "3454", col: "3412", maxWeight: 1000, maxVolume: 1000});
    });
    testChangePositionID();
});

async function testChangePositionID(){
    test("change positionID", async () => {
        const oldPositionID = "800234543412";
        const newPositionID = {newPositionID: "801234543412"};
        await positionService.changePositionId(oldPositionID, newPositionID);
        res = await positionService.getPositions();
        expect(res[0]).toEqual({
            positionID: "801234543412",
            aisleID: "8012",
            row: "3454",
            col: "3412",
            maxWeight: 1000,
            maxVolume: 1000,
            occupiedWeight: 0,
            occupiedVolume: 0
        });
    });
}

describe("delete a position", () => {
    beforeEach(async () => {
        await positionDAO.deletePositions();
        await positionDAO.createPosition({positionID: "800234543412", aisleID: "8002", row: "3454", col: "3412", maxWeight: 1000, maxVolume: 1000});
    });
    testDeletePosition();
});

async function testDeletePosition(){
    test("delete a position", async () => {
        const positionID = "800234543412";
        let res = await positionService.deletePosition(positionID);
        res = await positionService.getPositions();
        expect(res.length).toEqual(0);
    });
}