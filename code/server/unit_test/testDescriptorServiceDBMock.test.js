const TestDescriptorService = require("../services/testDescriptorService");
const testDescriptorDAO = require("../mockDAOs/mockTestDescriptorDAO");
const testDescriptorService = new TestDescriptorService(testDescriptorDAO);

describe("get testDescriptors", () => {
    testDescriptorDAO.getTestDescriptors.mockReturnValue({
        name: "testDescriptor 1",
        procedureDescription: "PD1",
        idSKU: 8
    });
    test("get testDescriptors", async () => {
        let res = await testDescriptorService.getTestDescriptors();
        expect(res).toEqual({
            name: "testDescriptor 1",
            procedureDescription: "PD1",
            idSKU: 8
        });
    });
});

describe("get a testDescriptor", () => {
    testDescriptorDAO.getTestDescriptor.mockReturnValue({
        id: 1,
        name: "testDescriptor 1",
        procedureDescription: "PD1",
        idSKU: 8
    });
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
});

describe("create a testDescriptor", () => {
    test("create a testDescriptor", async () => {
        const testDescriptor = {
            name: "testDescriptor 1",
            procedureDescription: "PD1",
            idSKU: 8
        }
        await testDescriptorService.createTestDescriptor(testDescriptor);
        expect(testDescriptorDAO.createTestDescriptor.mock.call).toBe(testDescriptor);
        expect(testDescriptorDAO.createTestDescriptor.mock.call).toBe(testDescriptor);
    });
});

describe("delete a testDescriptor", () => {
    test("delete a testDescriptor", async () => {
        const id = 1;
        await testDescriptorService.deleteTestDescriptor(id);
        expect(testDescriptorDAO.deleteTestDescriptor.mock.call).toBe(id);
    });
});
