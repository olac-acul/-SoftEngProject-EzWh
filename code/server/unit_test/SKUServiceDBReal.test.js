const SKUService = require("../services/SKUService");
const SKUDAO = require("../DAOs/SKUDAO");
const SKU_Service = new SKUService(SKUDAO);

describe("get SKUs", () => {
    beforeEach(async () => {
        await SKUDAO.deleteSKUs();
        await SKUDAO.addSKU({description: "d1", weight: 100, volume: 50, notes: "n1", price: 10.99, availableQuantity: 50});
    });
    testGetSKUs();
    testGetSKU();
});

async function testGetSKUs(){
    test("get SKUs", async () => {
        let res = await SKU_Service.getSKUs();
        expect(res).toEqual({
            id:1,
            description : "d1",
            weight : 100,
            volume : 50,
            notes : "n1",
            position : null,
            availableQuantity : 50,
            price : 10.99,
            testDescriptors : null
        });
    });
}

async function testGetSKU(){
    test("get an SKU", async () => {
        const id = 1;
        let res = await SKU_Service.getSKU(id);
        expect(res).toEqual({
            id:1,
            description : "d1",
            weight : 100,
            volume : 50,
            notes : "n1",
            position : null,
            availableQuantity : 50,
            price : 10.99,
            testDescriptors : null
        });
    });
}

describe("create an SKU", () => {
    beforeEach(async () => {
        await SKUDAO.deleteSKUs();
    });
    testAddSKU();
});

async function testAddSKU(){
    test("create an SKU", async () => {
        const id = 1;
        const SKU = {
            description : "d1",
            weight : 100,
            volume : 50,
            notes : "n1",
            availableQuantity : 50,
            price : 10.99,
        }
        let res = await SKU_Service.addSKU(SKU);
        res = await SKU_Service.getSKU(id);
        expect(res).toEqual({
            id:1,
            description : "d1",
            weight : 100,
            volume : 50,
            notes : "n1",
            position : null,
            availableQuantity : 50,
            price : 10.99,
            testDescriptors : null
        });
    });
}

describe("modify an SKU", () => {
    beforeEach(async () => {
        await SKUDAO.deleteSKUs();
        await SKUDAO.addSKU({description: "d1", weight: 100, volume: 50, notes: "n1", price: 10.99, availableQuantity: 50});
    });
    testModifySKU();
});

async function testModifySKU(){
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
        let res = await SKU_Service.modifySKU(id, newState);
        res = await SKU_Service.getSKU(id);
        expect(res).toEqual({
            id:1,
            description : "d2",
            weight : 150,
            volume : 100,
            notes : "n2",
            position : null,
            availableQuantity : 100,
            price : 9.99,
            testDescriptors : null
        });
    });
}

describe("modify an SKU position", () => {
    beforeEach(async () => {
        await SKUDAO.deleteSKUs();
        await SKUDAO.addSKU({description: "d1", weight: 100, volume: 50, notes: "n1", price: 10.99, availableQuantity: 50});
    });
    testModifySKUPosition();
});

async function testModifySKUPosition(){
    test("modify an SKU position", async () => {
        const id = 1;
        const newPosition = "800234523412";
        let res = await SKU_Service.modifySKUPosition(id, newPosition);
        res = await SKU_Service.getSKU(id);
        expect(res).toEqual({
            id:1,
            description : "d2",
            weight : 150,
            volume : 100,
            notes : "n2",
            position : "800234523412",
            availableQuantity : 100,
            price : 9.99,
            testDescriptors : null
        });
    });
}

describe("delete an SKU", () => {
    beforeEach(async () => {
        await SKUDAO.deleteSKUs();
        await SKUDAO.addSKU({description: "d1", weight: 100, volume: 50, notes: "n1", price: 10.99, availableQuantity: 50});
    });
    testDeleteSKU();
});

async function testDeleteSKU(){
    test("delete an SKU", async () => {
        const id = 1;
        let res = await SKU_Service.deleteSKU(id);
        res = await SKU_Service.getSKU(id);
        expect(res).toEqual("404");
    });
}