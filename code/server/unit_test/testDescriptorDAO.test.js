const testDescriptorDAO = require('../modules/DAOs/testDescriptorDAO');

describe('testTestDescriotorDAO', () => {
    beforeEach(async () => {
        await testDescriptorDAO.dropTable();
        await testDescriptorDAO.newTable();
    });

    test('delete all testDescriptors', async () => {
        var res = await testDescriptorDAO.getTestDescriptors();
        expect(res.length).toStrictEqual(0);
    });

    testCreateTestDescriptor_And_GetTestDescriptors_And_GetTestDescriptorById(1, "test descriptor 1", "PD1", 8)
    testModifyTestDescriptor("test descriptor 1", "PD1", 8, 1, "test descriptor 1", "PD2", 26);
    testDeleteTestDescriptor(1, "test descriptor 1", "PD1", 8);
});

function testCreateTestDescriptor_And_GetTestDescriptors_And_GetTestDescriptorById(id, name, procedureDescription, idSKU) {
    test('create new testDescriptor and get all testDescriptors and get a testDescriptor by id', async () => {
        await testDescriptorDAO.createTestDescriptor({name: name, procedureDescription: procedureDescription, idSKU: idSKU});
        var res = await testDescriptorDAO.getTestDescriptors();
        expect(res.length).toStrictEqual(1);
        res = await testDescriptorDAO.getTestDescriptorById(id);
        expect(res.id).toStrictEqual(id);
        expect(res.name).toStrictEqual(name);
        expect(res.procedureDescription).toStrictEqual(procedureDescription);
        expect(res.idSKU).toStrictEqual(idSKU);
    });
}

function testModifyTestDescriptor(name, procedureDescription, idSKU, id, newName, newProcedureDescription, newIdSKU){
    test("modify a testDescriptor", async () => {
        await testDescriptorDAO.createTestDescriptor({name: name, procedureDescription: procedureDescription, idSKU: idSKU});
        await testDescriptorDAO.modifyTestDescriptor(id, {newName: newName, newProcedureDescription: newProcedureDescription, newIdSKU: newIdSKU});   
        var res = await testDescriptorDAO.getTestDescriptorById(id);
        expect(res.id).toStrictEqual(id);
        expect(res.name).toStrictEqual(newName);
        expect(res.procedureDescription).toStrictEqual(newProcedureDescription);
        expect(res.idSKU).toStrictEqual(newIdSKU);
    });
}

function testDeleteTestDescriptor(id, name, procedureDescription, idSKU){
    test("delete a testDescriptor", async () => {
        await testDescriptorDAO.createTestDescriptor({name: name, procedureDescription: procedureDescription, idSKU: idSKU});
        await testDescriptorDAO.deleteTestDescriptor(id);   
        var res = await testDescriptorDAO.getTestDescriptors();
        expect(res.length).toEqual(0);
    });
}
