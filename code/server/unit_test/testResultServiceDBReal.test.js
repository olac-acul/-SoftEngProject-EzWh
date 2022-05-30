const TestResultService = require("../modules/services/testResultSevice");
const testResultDAO = require("../modules/mockDAOs/mockTestResultDAO");
const testResultService = new TestResultService(testResultDAO);

describe("get testResults by rfid", () => {
    beforeEach(async () => {
        await testResultDAO.dropTable();
        await testResultDAO.newTestResultTable();
        await testResultDAO.createTestResult({idTestDescriptor:14, Date:"2021/11/29", Result: false});
    });

    testGetTestResultsByRfid();
    testGetTestResultByRfidAndId();
    
});

async function testGetTestResultsByRfid(){
    test("get testResults by rfid", async () => {
        const RFID = '123123123';
        let res = await testResultService.getTestResultsByRfid(RFID);
        expect(res).toEqual({
            id: 1,
            idTestDescriptor: 14,
            Date: "2021/11/29",
            Result: false
        });
    });
}

async function testGetTestResultByRfidAndId(){
    test("get testResult by rfid and id", async () => {
        const RFID = '123123123';
        const id = 1;
        let res = await testResultService.getTestResultByRfidAndId(RFID, id);
        expect(res).toEqual({
            id: 1,
            idTestDescriptor: 14,
            Date: "2021/11/29",
            Result: false
        });
    });
}

describe("create a testResult", () => {
    beforeEach(async () => {
        await testResultDAO.dropTable();
        await testResultDAO.newTestResultTable();
    });
    testCreateTestResult();
});

async function testCreateTestResult(){
    test("create a Result", async () => {
        const RFID = '123123123'
        const testResult = {
            idTestDescriptor: 14,
            Date: "2021/11/29",
            Result: false
        }
        let res = await testResultService.createTestResult(testResult);
        res = await testResultService.getTestResultsByRfid(RFID);
        expect(res).toEqual({
            id: 1,
            idTestDescriptor: 14,
            Date: "2021/11/29",
            Result: false
        });
    });
}

describe("modify a testResult", () => {
    beforeEach(async () => {
        await testResultDAO.dropTable();
        await testResultDAO.newTestResultTable();
        await testResultDAO.createTestResult({idTestDescriptor:14, Date:"2021/11/29", Result: false});
    });
    testModifyTestResult();
});

async function testModifyTestResult(){
    test("modify a testResult", async () => {
        const RFID = '123123123';
        const id = 1;
        const newState = {
            newidTestDescriptor :12,
            newDate: "2021/11/29",
            newResult: true
        }
        let res = await testResultService.modifyTestResult(id, newState);
        res = await testResultService.getTestResultByRfidAndId(RFID, id);
        expect(res).toEqual({
            id: 1,
            newidTestDescriptor :12,
            newDate: "2021/11/29",
            newResult: true
        });
    });
}

describe("delete a testResult", () => {
    beforeEach(async () => {
        await testResultDAO.dropTable();
        await testResultDAO.newTestResultTable();
        await testResultDAO.createTestResult({idTestDescriptor:14, Date:"2021/11/29", Result: false});
    });
    testDeleteTestResult();
});

async function testDeleteTestResult(){
    test("delete a testResult", async () => {
        const RFID = '123123123';
        const id = 1;
        let res = await testResultService.deleteTestResult(id);
        res = await testResultService.getTestResultByRfidAndId(RFID, id);
        expect(res).toEqual("404");
    });
}