const testResultDAO = require('../modules/DAOs/testResultDAO');

describe('testTestResultDAO', () => {
    beforeEach(async () => {
        await testResultDAO.dropTable();
        await testResultDAO.newTestResultTable();
    });

    test('delete all testResults', async () => {
        const RFID = '123123123';
        var res = await testResultDAO.getTestResultsByRfid(RFID);
        expect(res.length).toStrictEqual(0);
    });

    testCreateTestResult_getTestResultsByRfid_getTestResultByRfidAndId('123123123', 2, {idTestDescriptor:12, Date:"2021/11/29", Result: true});
    testModifyTestResult('123123123', 2, {newIdTestDescriptor:14, newDate:"2021/11/29", newResult: false}, {idTestDescriptor:12, Date:"2021/11/29", Result: true});
    testDeleteTestResult('123123123', 2, {idTestDescriptor:12, Date:"2021/11/29", Result: true});
});

function testCreateTestResult_getTestResultsByRfid_getTestResultByRfidAndId(RFID, id, testResult) {
    test('create new testResult and get all testResult by rfid and get a testResult by id and rfid', async () => {
        await testResultDAO.createTestResult(testResult);
        var res = await testResultDAO.getTestResultsByRfid(RFID);
        expect(res.length).toStrictEqual(1);
        res = await testResultDAO.getTestResultByRfidAndId(RFID, id);
        expect(res.id).toStrictEqual(id);
        expect(res.idTestDescriptor).toStrictEqual(testResult.idTestDescriptor);
        expect(res.Date).toStrictEqual(testResult.Date);
        expect(res.Result).toStrictEqual(testResult.Result);
    });
}

function testModifyTestResult(RFID, id, newState, testResult){
    test("modify a testResult", async () => {
        await testResultDAO.createTestResult(testResult);
        await testResultDAO.modifyTestResult(RFID, id, newState);   
        var res = await testResultDAO.getTestResultByRfidAndId(RFID, id);
        expect(res.length).toStrictEqual(1);
        expect(res.id).toStrictEqual(id);
        expect(res.idTestDescriptor).toStrictEqual(newState.newIdTestDescriptor);
        expect(res.Date).toStrictEqual(newState.newDate);
        expect(res.Result).toStrictEqual(newState.newResult);
    });
}

function testDeleteTestResult(RFID, id, testResult){
    test("delete a testResult", async () => {
        await testResultDAO.createTestResult(testResult);
        await testResultDAO.deleteTestResult(RFID, id);   
        var res = await testDescriptorDAO.getTestDescriptors();
        expect(res).toEqual("404");
    });
}
