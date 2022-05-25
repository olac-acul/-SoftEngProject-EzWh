const SKUService = require("../modules/services/SKUService");
const SKUDAO = require("../modules/mockDAOs/mockSKUDAO");
const SKU_Service = new SKUService(SKUDAO);

describe("get an SKU", () => {
    SKUDAO.getSKU.mockReturnValue({
        id:8,
        description : "a new sku",
        weight : 100,
        volume : 50,
        notes : "first SKU",
        availableQuantity : 50,
        price : 10.99,
        testDescriptors : null
    });
    test("get an SKU", async () => {
        const id = 8;
        let res = await SKU_Service.getSKU(id);
        expect(res).toEqual({
            id:8,
            description : "a new sku",
            weight : 100,
            volume : 50,
            notes : "first SKU",
            availableQuantity : 50,
            price : 10.99,
            testDescriptors : null
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
        expect(SKUDAO.addSKU.mock.calls[0][0].description).toBe(SKU.description);
        expect(SKUDAO.addSKU.mock.calls[0][0].weight).toBe(SKU.weight);
        expect(SKUDAO.addSKU.mock.calls[0][0].volume).toBe(SKU.volume);
        expect(SKUDAO.addSKU.mock.calls[0][0].notes).toBe(SKU.notes);
        expect(SKUDAO.addSKU.mock.calls[0][0].availableQuantity).toBe(SKU.availableQuantity);
        expect(SKUDAO.addSKU.mock.calls[0][0].price).toBe(SKU.price);
    });
});

describe("modify an SKU", () => {
    test("modify an SKU", async () => {
        const id = 10;
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
        const id = 8;
        const newPosition = {position: "800234523412"};
        await SKU_Service.modifySKUPosition(id, newPosition);
        expect(SKUDAO.modifySKUPosition.mock.calls[0][0]).toBe(id);
        expect(SKUDAO.modifySKUPosition.mock.calls[0][1].position).toBe(newPosition.position);
    });
});

describe("delete an SKU", () => {
    test("delete an SKU", async () => {
        const id = 182;
        await SKU_Service.deleteSKU(id);
        expect(SKUDAO.deleteSKU.mock.calls[0][0]).toBe(id);
    });
});
