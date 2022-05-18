const testDescriptorDAO = require('../modules/testDescriptorDAO');

describe('testTestDescriotorDao', () => {
    beforeEach(async () => {
        await testDescriptorDAO.deleteTestDescriptors();
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
    test('create new testDescriptor', async () => {
        await testDescriptorDAO.createTestDescriptor(name, procedureDescription, idSKU);
        var res = await testDescriptor.getTestDescriptors();
        expect(res.length).toStrictEqual(1);
        res = await testDescriptorDAO.getTestDescriptorById(id);
        expect(res.id).toStrictEqual(id);
        expect(res.name).toStrictEqual(name);
        expect(res.procedureDescription).toStrictEqual(procedureDescription);
        expect(res.idSKU).toStrictEqual(idSKU);
    });
}

function testModifyTestDescriptor(name, procedureDescription, idSKU, id, newStatus){
    test("search SKU", async () => {
        await testDescriptorDAO.createTestDescriptor(name, procedureDescription, idSKU);
        await testDescriptorDAO.modifyTestDescriptor(id, newStatus);   
        var res = await testDescriptorDAO.getTestDescriptorById();
        expect(res.length).toStrictEqual(1);
        expect(res.id).toStrictEqual(id);
        expect(res.name).toStrictEqual(newStatus.name);
        expect(res.procedureDescription).toStrictEqual(newStatus.procedureDescription);
        expect(res.idSKU).toStrictEqual(newStatus.idSKU);
    });
}

function testDeleteTestDescriptor(id, name, procedureDescription, idSKU){
    test("delete a testDescriptor", async () => {
        await testDescriptorDAO.createTestDescriptor(name, procedureDescription, idSKU);
        await testDescriptorDAO.deleteTestDescriptor(id);   
        var res = await testDescriptorDAO.getTestDescriptors();
        expect(res.length).toStrictEqual(0);
    });
}
