const express = require('express');

const TestResultService = require('../services/testResultSevice');
const db = require('../DAOs/testResultDAO');

const testResultService = new TestResultService(db);

const router = express.Router();


//GET
router.get('/skuitems/:rfid/testResults', async (req, res) => {
    const rfid = req.params.rfid;
    try {
        // 401 Unauthorized (not logged in or wrong permissions)
        const testResults = await testResultService.getTestResultsByRfid(rfid);
        // Check validation of id
        if (testResults === 'Not Found') res.status(404).json({ error: `No test result for requested rfid` }).end();
        // 422 Unprocessable Entity (validation of id failed)
        // END OF VALIDATION
        res.status(200).json(testResults);
    } catch (err) {
        res.status(500).json({ error: `Generic error` }).end();
    }
});

router.get('/skuitems/:rfid/testResults/:id', async (req, res) => {
    const rfid = req.params.rfid;
    const id = req.params.id;
    try {
        // 401 Unauthorized (not logged in or wrong permissions)
        const testResult = await testResultService.getTestResultByRfidAndId(rfid, id);
        // Check validation of id
        if (testResult === 'Not Found') res.status(404).json({ error: `No test result for requested rfid` }).end();
        // 422 Unprocessable Entity (validation of id failed)
        // END OF VALIDATION
        res.status(200).json(testResult);
    } catch (err) {
        res.status(500).json({ error: `Generic error` }).end();
    }
});


//POST
router.post('/skuitems/testResult', async (req, res) => {
    try {
        // 401 Unauthorized (not logged in or wrong permissions)
        // Check validation of request body
        if (!req.body) return res.status(422).json({ error: `Validation of request body failed` }).end();
        let testResult = req.body;
        if (!(testResult && testResult.idTestDescriptor && testResult.Date && testResult.Result && testResult.rfid))
            return res.status(422).json({ error: `Validation of request body failed` }).end();
        // Check number of elements of the request 
        if (Object.entries(testResult).length !== 4) return res.status(422).json({ error: `Validation of request body failed` }).end();
        // END OF VALIDATION
        await testResultService.createTestResult(testResult);
        return res.status(201).end();

    } catch (err) {
        res.status(503).json({ error: `Generic error` }).end();
    }
});


//PUT
router.put('/skuitems/:rfid/testResult/:id', async (req, res) => {
    try {
        const rfid = req.params.rfid;
        const id = req.params.id;
        const newIdTestDescriptor = req.body.newIdTestDescriptor;
        const newDate = req.body.newDate;
        const newResult = req.body.newResult;
        updatedElements = await testResultService.modifyTestResult(rfid, id, newIdTestDescriptor, newDate, newResult);
        if (updatedElements === 0) return res.status(404).json({ error: `No Test Result associated to RFID` }).end();
        return res.status(200).end();
    } catch (err) {
        res.status(503).json({ error: `Generic error` }).end();
    }
});


//DELETE
router.delete('/skuitems/:rfid/testResult/:id', async (req, res) => {
    const rfid = req.params.rfid;
    const id = req.params.id;
    try {
        // 401 Unauthorized (not logged in or wrong permissions)
        const deletedTestResult = await testResultService.deleteTestResult(rfid, id);
        // Check id validation
        if (deletedTestResult === 0) res.status(422).json({ error: `Validation of rfid failed` }).end();
        // END OF VALIDATION
        res.status(204).end();
    } catch (err) {
        res.status(503).json({ error: `Generic error` }).end();
    }
});

module.exports = router;