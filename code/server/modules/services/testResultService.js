const dayjs = require('dayjs');
dayjs().format();
class TestResultService {
    dao;

    constructor(dao) {
        this.dao = dao;
    }

    getTestResultsByRfid = async (rfid) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        if (isNaN(rfid) || rfid.length !== 32)
            return '422';
        const validatedRFID = rfid;
        const rfidValid = await this.dao.getSKUItem(validatedRFID);
        if (rfidValid === '404')
            return '404';
        const testResults = await this.dao.getTestResultsByRfid(validatedRFID);
        // if (testResults === '404')
        //     return '404';
        return testResults;
    }

    getTestResultByRfidAndId = async (rfid, id) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        if (isNaN(rfid) || rfid.length !== 32)
            return '422';
        const validatedRFID = rfid;
        if (isNaN(id) || Number(id) < 0)
            return '422';
        const validatedId = Number(id);
        const testResult = await this.dao.getTestResultByRfidAndId(validatedRFID, validatedId);
        if (testResult === '404')
            return '404';
        return testResult;
    }

    createTestResult = async (testResult) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        if (Object.keys(testResult).length !== 4)
            return '422';
        if (testResult.rfid === undefined || testResult.idTestDescriptor === undefined || testResult.Date === undefined || testResult.Result === undefined)
            return '422';
        if (isNaN(testResult.rfid) || testResult.rfid.length !== 32)
            return '422';
        const validatedRFID = testResult.rfid;
        if (typeof testResult.idTestDescriptor != "number" || testResult.idTestDescriptor < 0)
            return '422';
        if (!dayjs(testResult.Date).isValid() || testResult.Date.length !== 10)
            return '422';
        if (typeof testResult.Result !== 'boolean')
            return '422';
        const validatedTestResult = {
            idTestDescriptor: testResult.idTestDescriptor,
            Date: testResult.Date,
            Result: testResult.Result
        };
        const rfidValid = await this.dao.getSKUItem(validatedRFID);
        if (rfidValid === '404')
            return '404';
        const testDescValid = await this.dao.getTestDescriptorById(validatedTestResult.idTestDescriptor);
        if (testDescValid === '404')
            return '404';
        await this.dao.newTestResultTable();
        const lastId = await this.dao.createTestResult(validatedTestResult);
        await this.dao.newTestResult_join_SKUItemTable();
        await this.dao.createTestResult_join_SKUItem(lastId, validatedRFID);
    }

    modifyTestResult = async (rfid, id, newState) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        if (isNaN(rfid) || rfid.length !== 32)
            return '422';
        const validatedRFID = rfid;
        if (isNaN(id) || Number(id) < 0)
            return '422';
        const validatedId = Number(id);
        if (Object.keys(newState).length !== 3)
            return '422';
        if (newState.newIdTestDescriptor === undefined || newState.newDate === undefined || newState.newResult === undefined)
            return '422';
        if (typeof newState.newIdTestDescriptor != "number" || newState.newIdTestDescriptor < 0)
            return '422';
        if (!dayjs(newState.newDate).isValid() || newState.newDate.length !== 10)
            return '422';
        if (typeof newState.newResult !== 'boolean')
            return '422';
        const validatedNewState = {
            newIdTestDescriptor: newState.newIdTestDescriptor,
            newDate: newState.newDate,
            newResult: newState.newResult
        };
        const testResValid = await this.dao.getTestResultByRfidAndId(validatedRFID, validatedId);
        if (testResValid === '404')
            return '404';
        const rfidValid = await this.dao.getSKUItem(validatedRFID);
        if (rfidValid === '404')
            return '404';
        const testDescValid = await this.dao.getTestDescriptorById(validatedNewState.newIdTestDescriptor);
        if (testDescValid === '404')
            return '404';
        await this.dao.modifyTestResult(validatedId, validatedNewState);
    }

    deleteTestResult = async (rfid, id) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        if (isNaN(rfid) || rfid.length !== 32)
            return '422';
        const validatedRFID = rfid;
        if (isNaN(id) || Number(id) < 0)
            return '422';
        const validatedId = Number(id);
        await this.dao.deleteTestResult(validatedId);
        await this.dao.deleteTestResult_join_SKUItem(validatedRFID, validatedId);       
    }

    deleteTestResults = async () => {
        await this.dao.deleteTestResults();
    }
}

module.exports = TestResultService;