const TestDescriptorService = require("../modules/services/testDescriptorService");
const testDescriptorDAO = require("../modules/mockDAOs/mockTestDescriptorDAO");
const testDescriptorService = new TestDescriptorService(testDescriptorDAO);

describe("get testDescriptors", () => {
    testDescriptorDAO.getTestDescriptors.mockReturnValue({
        id: 1,
        name: "testDescriptor 1",
        procedureDescription: "PD1",
        idSKU: 8
    });
    test("get testDescriptors", async () => {
        let res = await testDescriptorService.getTestDescriptors();
        expect(res).toEqual({
            id: 1,
            name: "testDescriptor 1",
            procedureDescription: "PD1",
            idSKU: 8
        });
    });
});

describe("get a testDescriptor", () => {
    testDescriptorDAO.getTestDescriptorById.mockReturnValue({
        id: 1,
        name: "testDescriptor 1",
        procedureDescription: "PD1",
        idSKU: 8
    });
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
});

describe("create a testDescriptor", () => {
    test("create a testDescriptor", async () => {
        const testDescriptor = {
            name: "testDescriptor 1",
            procedureDescription: "PD1",
            idSKU: 8
        }
        await testDescriptorService.createTestDescriptor(testDescriptor);
        expect(testDescriptorDAO.createTestDescriptor.mock.calls[0][0].name).toBe(testDescriptor.name);
        expect(testDescriptorDAO.createTestDescriptor.mock.calls[0][0].procedureDescription).toBe(testDescriptor.procedureDescription);
        expect(testDescriptorDAO.createTestDescriptor.mock.calls[0][0].idSKU).toBe(testDescriptor.idSKU);
    });
});

describe("modify a testDescriptor", () => {
    test("modify a testDescriptor", async () => {
        const id = 1;
        const newStatus = {
            newName: "testDescriptor 1",
            newProcedureDescription: "PD2",
            newIdSKU: 26
        }
        await testDescriptorService.modifyTestDescriptor(id, newStatus);
        expect(testDescriptorDAO.modifyTestDescriptor.mock.calls[0][0]).toBe(id);
        expect(testDescriptorDAO.modifyTestDescriptor.mock.calls[0][1].newName).toBe(newStatus.newName);
        expect(testDescriptorDAO.modifyTestDescriptor.mock.calls[0][1].newProcedureDescription).toBe(newStatus.newProcedureDescription);
        expect(testDescriptorDAO.modifyTestDescriptor.mock.calls[0][1].newIdSKU).toBe(newStatus.newIdSKU);
    });
});

describe("delete a testDescriptor", () => {
    test("delete a testDescriptor", async () => {
        const id = 1;
        await testDescriptorService.deleteTestDescriptor(id);
        expect(testDescriptorDAO.deleteTestDescriptor.mock.calls[0][0]).toBe(id);
    });
});
