class TestDescriptorService {
    dao;

    constructor(dao) {
        this.dao = dao;
    }

    getTestDescriptors = async () => {
        // 401 Unauthorized (not logged in or wrong permissions)
        const testDescriptors = await this.dao.getTestDescriptors();
        return testDescriptors;
    }

    getTestDescriptorById = async (id) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        if (isNaN(id) || Number(id) < 0)
            return '422';
        const validatedId = Number(id);
        const testDescriptor = await this.dao.getTestDescriptorById(validatedId);
        if (testDescriptor === '404')
            return '404';
        return testDescriptor;
    }

    createTestDescriptor = async (testDescriptor) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        if (Object.keys(testDescriptor).length !== 3)
            return '422';
        if (testDescriptor.name === undefined || testDescriptor.procedureDescription === undefined || testDescriptor.idSKU === undefined)
            return '422';
        if (typeof testDescriptor.name != "string")
            return '422';
        if (typeof testDescriptor.procedureDescription != "string")
            return '422';
        if (typeof testDescriptor.idSKU != "number" || testDescriptor.idSKU < 0)
            return '422';
        const validatedTestDescriptor = {
            name: testDescriptor.name,
            procedureDescription: testDescriptor.procedureDescription,
            idSKU: testDescriptor.idSKU
        };
        const status = await this.dao.searchSKU(validatedTestDescriptor.idSKU);
        if (status === false)
            return '404';
        await this.dao.newTable();
        const lastId = await this.dao.createTestDescriptor(validatedTestDescriptor);

        // added for tests
        const RFIDs = await this.dao.getRFIDsBySKUId(validatedTestDescriptor.idSKU);
        for (let rfid of RFIDs) {
            const testResultId = await this.dao.createTestResult(lastId);
            await this.dao.createTestResult_join_SKUItem(testResultId, rfid);
        }
    }

    modifyTestDescriptor = async (id, newStatus) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        if (isNaN(id) || Number(id) < 0)
            return '422';
        const validatedId = Number(id);
        if (Object.keys(newStatus).length !== 3)
            return '422';
        if (newStatus.newName === undefined || newStatus.newProcedureDescription === undefined || newStatus.newIdSKU === undefined)
            return '422';
        if (typeof newStatus.newName != "string")
            return '422';
        if (typeof newStatus.newProcedureDescription != "string")
            return '422';
        if (typeof newStatus.newIdSKU != "number" || newStatus.newIdSKU < 0)
            return '422';
        const validatedNewStatus = {
            newName: newStatus.newName,
            newProcedureDescription: newStatus.newProcedureDescription,
            newIdSKU: newStatus.newIdSKU
        };
        const status = await this.dao.searchSKU(validatedNewStatus.newIdSKU);
        if (status === false)
            return '404';
        const updatedElements = await this.dao.modifyTestDescriptor(validatedId, validatedNewStatus);
        if (updatedElements === 0)
            return '404';
        return;
    }

    deleteTestDescriptor = async (id) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        if (isNaN(id) || Number(id) < 0)
            return '422';
        const validatedId = Number(id);
        await this.dao.deleteTestDescriptor(validatedId);
        return;
    }

    deleteTestDescriptors = async () => {
        await this.dao.deleteTestDescriptors();
        }

}

module.exports = TestDescriptorService;