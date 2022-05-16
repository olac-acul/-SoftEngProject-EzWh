class TestResultService {
    dao;

    constructor(dao) {
        this.dao = dao;
    }

    getTestResultsByRfid = async (rfid) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        const testResults = await this.dao.getTestResultsByRfid(rfid);
        return testResults;
    }

    getTestResultByRfidAndId = async (rfid, id) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        const testResults = await this.dao.getTestResultByRfidAndId(rfid, id);
        return testResults;
    }

    createTestResult = async (testResult) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        await this.dao.newTable();
        await this.dao.createTestResult(testResult);
    }

    modifyTestResult = async (rfid, id, newIdTestDescriptor, newDate, newResult) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        const updatedElements = await this.dao.modifyTestResult(rfid, id, newIdTestDescriptor, newDate, newResult);
        return updatedElements;
    }

    deleteTestResult = async (rfid, id) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        const deletedTestResult = await this.dao.deleteTestResult(rfid, id);
        return deletedTestResult;
    }
}

module.exports = TestResultService;