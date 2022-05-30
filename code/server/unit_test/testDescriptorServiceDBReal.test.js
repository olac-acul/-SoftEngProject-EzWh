const TestDescriptorService = require("../modules/services/testDescriptorService");
const testDescriptorDAO = require("../modules/DAOs/testDescriptorDAO");
const testDescriptorService = new TestDescriptorService(testDescriptorDAO);

describe("get testDescriptor", () => {
    beforeEach(async () => {
        await testDescriptorDAO.dropTable();
        await testDescriptorDAO.newTable();
        await testDescriptorDAO.createTestDescriptor({name: "testDescriptor 1", procedureDescription: "PD1", idSKU: 8});
    });
    testGetTestDescriptors();
    testGetTestDescriptorById();
});

async function testGetTestDescriptors(){
    test("get testDescriptors", async () => {
        let res = await testDescriptorService.getTestDescriptors();
        expect(res[0]).toEqual({
            id: 1,
            name: "testDescriptor 1",
            procedureDescription: "PD1",
            idSKU: 8
        });
    });
}

async function testGetTestDescriptorById(){
    test("get a testDescriptor", async () => {
        const id = 1;
        let res = await testDescriptorService.getTestDescriptorById(id);
        expect(res).toEqual({
            id: 1,
            name: "testDescriptor 1",
            procedureDescription: "PD1",
            idSKU: 8
        });
    });
}

describe("create a testDescriptor", () => {
    beforeEach(async () => {
        await testDescriptorDAO.dropTable();
        await testDescriptorDAO.newTable();
    });
    testCreateTestDescriptor();
});

async function testCreateTestDescriptor(){
    test("create a testDescriptor", async () => {
        const testDescriptor = {
            name: "testDescriptor 1",
            procedureDescription: "PD1",
            idSKU: 8
        }
        let res = await testDescriptorService.createTestDescriptor(testDescriptor);
        res = await testDescriptorService.getTestDescriptorById(1);
        expect(res).toEqual({
            id: 1,
            name: "testDescriptor 1",
            procedureDescription: "PD1",
            idSKU: 8
        });
    });
}

describe("modify a testDescriptor", () => {
    beforeEach(async () => {
        await testDescriptorDAO.dropTable();
        await testDescriptorDAO.newTable();
        await testDescriptorDAO.createTestDescriptor({name: "testDescriptor 1", procedureDescription: "PD1", idSKU: 8});
    });
    testModifyTestDescriptor();
});

async function testModifyTestDescriptor(){
    test("modify a testDescriptor", async () => {
        const id = 1;
        const newStatus = {
            newName: "testDescriptor 1",
            newProcedureDescription: "PD2",
            newIdSKU: 26
        }
        let res = await testDescriptorService.modifyTestDescriptor(id, newStatus);
        res = await testDescriptorService.getTestDescriptorById(id);
        expect(res).toEqual({
            id: 1,
            name: "testDescriptor 1",
            procedureDescription: "PD2",
            idSKU: 26
        });
    });
}

describe("delete a testDescriptor", () => {
    beforeEach(async () => {
        await testDescriptorDAO.dropTable();
        await testDescriptorDAO.newTable();
        await testDescriptorDAO.createTestDescriptor({name: "testDescriptor 1", procedureDescription: "PD1", idSKU: 8});
    });
    testDeleteTestDescriptor();
});

async function testDeleteTestDescriptor(){
    test("delete a testDescriptor", async () => {
        const id = 1;
        await testDescriptorService.deleteTestDescriptor(id);
        res = await testDescriptorService.getTestDescriptors();
        expect(res.length).toEqual(0);
    });
}