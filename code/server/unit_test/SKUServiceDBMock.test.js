const SKUService = require("../services/SKUService");
const SKUDAO = require("../mockDAOs/mockSKUDAO");
const SKU_Service = new SKUService(SKUDAO);

describe("get SKUs", () => {
    SKUDAO.getSKUs.mockReturnValue(  {
        id:1,
        description : "d1",
        weight : 100,
        volume : 50,
        notes : "n1",
        position : "800234523412",
        availableQuantity : 50,
        price : 10.99,
        testDescriptors : [1,3,4]
    }
  );
    test("get SKUs", async () => {
        let res = await SKU_Service.getSKUs();
        expect(res).toEqual({
            id:1,
            description : "d1",
            weight : 100,
            volume : 50,
            notes : "n1",
            position : "800234523412",
            availableQuantity : 50,
            price : 10.99,
            testDescriptors : [1,3,4]
        });
    });
});

describe("get an SKU", () => {
    SKUDAO.getSKU.mockReturnValue({
        id:1,
        description : "d1",
        weight : 100,
        volume : 50,
        notes : "n1",
        position : "800234523412",
        availableQuantity : 50,
        price : 10.99,
        testDescriptors : [1,3,4]
    });
    test("get an SKU", async () => {
        const id = 1;
        let res = await SKU_Service.getSKU(id);
        expect(res).toEqual({
            id:1,
            description : "d1",
            weight : 100,
            volume : 50,
            notes : "n1",
            position : "800234523412",
            availableQuantity : 50,
            price : 10.99,
            testDescriptors : [1,3,4]
        });
    });
});

describe("create an SKU", () => {
    test("create an SKU", async () => {
        const SKU = {
            description : "d1",
            weight : 100,
            volume : 50,
            notes : "n1",
            availableQuantity : 50,
            price : 10.99,
        };
        await SKU_Service.addSKU(SKU);
        expect(SKUDAO.addSKU.mock.calls[0]).toBe(SKU);
    });
});

describe("modify an SKU", () => {
    test("modify an SKU", async () => {
        const id = 1;
        const newState = {
            newDescription : "d2",
            newWeight : 150,
            newVolume : 100,
            newNotes : "n2",
            newPrice : 9.99,
            newAvailableQuantity : 100
        };
        await SKU_Service.modifySKU(id, newState);
        expect(SKUDAO.modifySKU.mock.calls[0]).toBe(id);
        expect(SKUDAO.modifySKU.mock.calls[1]).toBe(newState);
    });
});

describe("modify an SKU position", () => {
    test("modify an SKU position", async () => {
        const id = 1;
        const newPosition = "800234523412";
        await SKU_Service.modifySKUPosition(id, newPosition);
        expect(SKUDAO.modifySKUPosition.mock.calls[0]).toBe(id);
        expect(SKUDAO.modifySKUPosition.mock.calls[1]).toBe(newPosition);
    });
});

describe("delete an SKU", () => {
    test("delete an SKU", async () => {
        const id = 1;
        await SKU_Service.deleteSKU(id);
        expect(SKUDAO.deleteSKU.mock.calls[0]).toBe(id);
    });
});
