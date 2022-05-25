const SKUDAO = require('../modules/DAOs/SKUDAO');

describe('testSKUDAO', () => {
    testAddSKU_And_GetAllSKUs_And_GetSKU(183, {description: "d1", weight: 100, volume: 50, notes: "n1", price: 10.99, availableQuantity: 50});
    testModifySKUPositionAndGetSKUPosition(180, "802234523412");
    testModifySKU(180, {newDescription: "d2", newWeight: 150, newVolume: 100, newNotes: "n2", newPrice: 9.99, newAvailableQuantity: 100});
    testDeleteSKU(183);
});

function testAddSKU_And_GetAllSKUs_And_GetSKU(id, SKU) {
    test('create new SKU and get all SKUs and get an SKU by id', async () => {
        await SKUDAO.addSKU(SKU);
        res = await SKUDAO.getSKU(id);
        expect(res.id).toStrictEqual(id);
        expect(res.description).toStrictEqual(SKU.description);
        expect(res.weight).toStrictEqual(SKU.weight);
        expect(res.volume).toStrictEqual(SKU.volume);
        expect(res.notes).toStrictEqual(SKU.notes);
        expect(res.price).toStrictEqual(SKU.price);
        expect(res.availableQuantity).toStrictEqual(SKU.availableQuantity);
    });
}

function testModifySKUPositionAndGetSKUPosition(id, newPosition) {
    test('mmodify position of an SKU and get position of it', async () => {
        await SKUDAO.modifySKUPosition(id, newPosition);
        res = await SKUDAO.getSKUPosition(id);
        expect(res).toStrictEqual(newPosition);
    });
}

function testModifySKU(id, newState){
    test("modify an SKU", async () => {
        await SKUDAO.modifySKU(id, newState) ;
        var res = await SKUDAO.getSKU(id);
        expect(res.id).toStrictEqual(id);
        expect(res.description).toStrictEqual(newState.newDescription);
        expect(res.weight).toStrictEqual(newState.newWeight);
        expect(res.volume).toStrictEqual(newState.newVolume);
        expect(res.notes).toStrictEqual(newState.newNotes);
        expect(res.price).toStrictEqual(newState.newPrice);
        expect(res.availableQuantity).toStrictEqual(newState.newAvailableQuantity);
    });
}

function testDeleteSKU(id){
    test("delete an SKU", async () => {
        await SKUDAO.deleteSKU(id);   
        var res = await SKUDAO.getSKU(id);
        expect(res).toEqual("404");
    });
}
