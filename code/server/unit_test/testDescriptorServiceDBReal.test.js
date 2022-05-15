const TestDescriptorService = require("../services/testDescriptorService");
const testDescriptorDAO = require("../DAOs/testDescriptorDAO");
const testDescriptorService = new TestDescriptorService(testDescriptorDAO);

describe("get testDescriptors", () => {
    beforeEach(async () => {
        await testDescriptorDAO.deleteTestDescriptors();
        await testDescriptorDAO.createTestDescriptor("testDescriptor 1", "PD1", 8);
    });
    testGetTestDescriptors();
    testGetTestDescriptor();
});

async function testGetTestDescriptors(){
    test("get testDescriptors", async () => {
        let res = await testDescriptorService.getTestDescriptors();
        expect(res).toEqual({
            id: 1,
            name: "testDescriptor 1",
            procedureDescription: "PD1",
            idSKU: 8
        });
    });
}

async function testGetTestDescriptor(){
    test("get a testDescriptor", async () => {
        const id = 1;
        let res = await testDescriptorService.getTestDescriptor(id);
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
        await testDescriptorDAO.deleteTestDescriptors();
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
        res = await testDescriptorService.getTestDescriptors();
        expect(res).toEqual({
            id: 1,
            name: "testDescriptor 1",
            procedureDescription: "PD1",
            idSKU: 8
        });
    });
}

describe("delete a testDescriptor", () => {
    beforeEach(async () => {
        await testDescriptorDAO.deleteTestDescriptors();
        await testDescriptorDAO.createTestDescriptor("testDescriptor 1", "PD1", 8);
    });
    testDeleteTestDescriptor();
});

async function testDeleteTestDescriptor(){
    test("delete a testDescriptor", async () => {
        const id = 1;
        let res = await testDescriptorService.deleteTestDescriptor(id);
        res = await testDescriptorService.getTestDescriptors();
        //expect(res.body).toEqual(null);
    });
}