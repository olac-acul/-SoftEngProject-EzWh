const SKUService = require("../modules/services/SKUService");
const SKUDAO = require("../modules/DAOs/SKUDAO");
const SKU_Service = new SKUService(SKUDAO);

describe("get an SKU", () => {
    testGetSKU();
});

async function testGetSKU(){
    test("get an SKU", async () => {
        const id = 8;
        let res = await SKU_Service.getSKU(id);
        expect(res).toEqual({
            id:8,
            description : "a new sku",
            weight : 100,
            volume : 50,
            notes : "first SKU",
            position : "800234523412",
            availableQuantity : 50,
            price : 10.99,
            testDescriptors: undefined
        });
    });
}

describe("create an SKU", () => {
    testAddSKU();
});

async function testAddSKU(){
    test("create an SKU", async () => {
        const id = 181;
        const SKU = {
            description : "d1",
            weight : 300,
            volume : 200,
            notes : "n1",
            availableQuantity : 50,
            price : 20.99
        };
        let res = await SKU_Service.addSKU(SKU);
        res = await SKU_Service.getSKU(id);
        expect(res).toEqual({
            id:186,
            description : "d1",
            weight : 300,
            volume : 200,
            notes : "n1",
            position : null,
            availableQuantity : 50,
            price : 20.99,
            testDescriptors: undefined
        });
    });
}

describe("modify an SKU", () => {
    testModifySKU();
});

async function testModifySKU(){
    test("modify an SKU", async () => {
        const id = 26;
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
            id:26,
            description : "d2",
            weight : 150,
            volume : 100,
            notes : "n2",
            position : "806333783520",
            availableQuantity : 100,
            price : 9.99,
            testDescriptors: undefined
        });
    });
}

describe("modify an SKU position", () => {
    testModifySKUPosition();
});

async function testModifySKUPosition(){
    test("modify an SKU position", async () => {
        const id = 8;
        const newPosition = "802234523412";
        let res = await SKU_Service.modifySKUPosition(id, newPosition);
        res = await SKU_Service.getSKU(id);
        expect(res).toEqual({
            id:8,
            description : "a new sku",
            weight : 100,
            volume : 50,
            notes : "first SKU",
            position : "802234523412",
            availableQuantity : 50,
            price : 10.99, 
            testDescriptors: undefined
        });
    });
}

describe("delete an SKU", () => {
    testDeleteSKU();
});

async function testDeleteSKU(){
    test("delete an SKU", async () => {
        const id = 181;
        let res = await SKU_Service.deleteSKU(10);
        res = await SKU_Service.getSKU(id);
        expect(res).toEqual("404");
    });
}