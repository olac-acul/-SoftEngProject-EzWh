const PositionService = require("../modules/services/positionService");
const positionDAO = require("../modules/mockDAOs/mockPositionDAO");
const positionService = new PositionService(positionDAO);

describe("get positions", () => {
    positionDAO.getPositions.mockReturnValue({
        positionID: "800234543412",
            aisleID: "8002",
            row: "3454",
            col: "3412",
            maxWeight: 1000,
            maxVolume: 1000
    });
    test("get positions", async () => {
        let res = await positionService.getPositions();
        expect(res).toEqual({
            positionID: "800234543412",
            aisleID: "8002",
            row: "3454",
            col: "3412",
            maxWeight: 1000,
            maxVolume: 1000
        });
    });
});

describe("create a position", () => {
    test("create a position", async () => {
        const position = {
            positionID: "800234543412",
            aisleID: "8002",
            row: "3454",
            col: "3412",
            maxWeight: 1000,
            maxVolume: 1000
        };
        await positionService.createPosition(position);
        expect(positionDAO.createPosition.mock.calls[0]).toBe(position);
    });
});

describe("modify a position", () => {
    test("modify a position", async () => {
        const oldPositionID = "800234543412";
        const position = {
            aisleID: "8012",
            row: "3454",
            col: "3412",
            maxWeight: 1000,
            maxVolume: 1000,
            occupiedWeight: 300,
            occupiedVolume:150
        };
        await positionService.modifyPosition(oldPositionID, position);
        expect(positionDAO.modifyPosition.mock.calls[0]).toBe(oldPositionID);
        expect(positionDAO.modifyPosition.mock.calls[1]).toBe(position.aisleID + position.row + position.col);
        expect(positionDAO.modifyPosition.mock.calls[2]).toBe(position);
    });
});

describe("change positionID", () => {
    test("change positionID", async () => {
        const oldPositionID = "800234543412";
        const newPositionID = "801234543412";
        await positionService.changePositionId(oldPositionID, newPositionID);
        expect(positionDAO.changePositionId.mock.calls[0]).toBe(oldPositionID);
        expect(positionDAO.changePositionId.mock.calls[1]).toBe(newPositionID).slice(0,4);
        expect(positionDAO.changePositionId.mock.calls[2]).toBe(newPositionID).slice(4,8);
        expect(positionDAO.changePositionId.mock.calls[3]).toBe(newPositionID).slice(8,12);
        expect(positionDAO.changePositionId.mock.calls[4]).toBe(newPositionID);
    });
});

describe("delete a position", () => {
    test("delete a position", async () => {
        const positionID = "800234543412";
        await positionService.deletePosition(positionID);
        expect(positionDAO.deletePosition.mock.calls[0]).toBe(positionID);
    });
});
