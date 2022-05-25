const TestResultService = require("../modules/services/testResultSevice");
const testResultDAO = require("../modules/mockDAOs/mockTestResultDAO");
const testResultService = new TestResultService(testResultDAO);

describe("get testResults by rfid", () => {
    testResultDAO.getTestResultsByRfid.mockReturnValue({
        id: 1,
        idTestDescriptor: 14,
        Date: "2021/11/29",
        Result: false
    });
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
});

describe("get testResults by rfid and id", () => {
    testResultDAO.getTestResultsByRfidAndId.mockReturnValue({
        id: 1,
        idTestDescriptor: 14,
        Date: "2021/11/29",
        Result: false
    });
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
});

describe("create a testResult", () => {
    test("create a testResult", async () => {
        const testResult = {
            idTestDescriptor: 14,
            Date: "2021/11/29",
            Result: false
        }
        await testResultService.createTestResult(testResult);
        expect(testResultDAO.createTestResult.mock.calls[0][0].id).toBe(testResult.id);
        expect(testResultDAO.createTestResult.mock.calls[0][0].idTestDescriptor).toBe(testResult.idTestDescriptor);
        expect(testResultDAO.createTestResult.mock.calls[0][0].Date).toBe(testResult.Date);
        expect(testResultDAO.createTestResult.mock.calls[0][0].Result).toBe(testResult.Result);
    });
});

describe("modify a testResult", () => {
    test("modify a testResult", async () => {
        const id = 1;
        const newState = {
            newIdTestDescriptor :12,
            newDate: "2021/11/29",
            newResult: true
        }
        await testResultService.modifyTestResult(id, newState);
        expect(testResultDAO.modifyTestResult.mock.calls[0][0]).toBe(id);
        expect(testResultDAO.modifyTestResult.mock.calls[0][1].newIdTestDescriptor).toBe(newState.newIdTestDescriptor);
        expect(testResultDAO.modifyTestResult.mock.calls[0][1].newDate).toBe(newState.newDate);
        expect(testResultDAO.modifyTestResult.mock.calls[0][1].newResult).toBe(newState.newResult);

    });
});

describe("delete a testResult", () => {
    test("delete a testResult", async () => {
        const id = 1;
        await testResultService.deleteTestResult(id);
        expect(testResultDAO.deleteTestResult.mock.calls[0][0]).toBe(id);
    });
});