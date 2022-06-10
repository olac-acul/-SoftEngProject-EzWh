const express = require('express');

const TestResultService = require('../services/testResultService');
const db = require('../DAOs/testResultDAO');

const testResultService = new TestResultService(db);

const router = express.Router();


//GET
router.get('/skuitems/:rfid/testResults', async (req, res) => {
    try {
        const testResults = await testResultService.getTestResultsByRfid(req.params.rfid);
        if (testResults === '422')
            res.status(422).json({ error: `validation of rfid failed` }).end();
        else if (testResults === '404')
            return res.status(404).json({ error: `no sku item associated to rfid` }).end();
        else
            res.status(200).json(testResults);
    } catch (err) {
        res.status(500).json({ error: `Generic error` }).end();
    }
});

router.get('/skuitems/:rfid/testResults/:id', async (req, res) => {
    try {
        const testResult = await testResultService.getTestResultByRfidAndId(req.params.rfid, req.params.id);
        if (testResult === '422')
            res.status(422).json({ error: `validation of id or of rfid failed` }).end();
        else if (testResult === '404')
            return res.status(404).json({ error: `no test result associated to id or no sku item associated to rfid` }).end();
        else
            res.status(200).json(testResult);
    } catch (err) {
        res.status(500).json({ error: `Generic error` }).end();
    }
});


//POST
router.post('/skuitems/testResult', async (req, res) => {
    try {
        const status = await testResultService.createTestResult(req.body);
        if (status === '422')
            res.status(422).json({ error: `validation of request body or of rfid failed` }).end();
        else if (status === '404')
            return res.status(404).json({ error: `no sku item associated to rfid or no test descriptor associated to idTestDescriptor` }).end();
        else
            return res.status(201).end();
    } catch (err) {
        res.status(503).json({ error: `Generic error` }).end();
    }
});


//PUT
router.put('/skuitems/:rfid/testResult/:id', async (req, res) => {
    try {
        const status = await testResultService.modifyTestResult(req.params.rfid, req.params.id, req.body);
        if (status === '422')
            res.status(422).json({ error: `validation of request body, of id or of rfid failed` }).end();
        else if (status === '404')
            return res.status(404).json({ error: `no sku item associated to rfid or no test descriptor associated to newIdTestDescriptor or no test result associated to id` }).end();
        else
            return res.status(200).end();
    } catch (err) {
        res.status(503).json({ error: `Generic error` }).end();
    }
});


//DELETE
router.delete('/skuitems/:rfid/testResult/:id', async (req, res) => {
    try {
        const status = await testResultService.deleteTestResult(req.params.rfid, req.params.id);
        if (status === '422')
            res.status(422).json({ error: `validation of id or of rfid failed` }).end();
        else
            res.status(204).end();
    } catch (err) {
        res.status(503).json({ error: `Generic error` }).end();
    }
});

// router.delete('/skuitems/testResults', async (req, res) => {
//     try {
//         await testResultService.deleteTestResults();
//         res.status(204).end();
//     } catch (err) {
//         res.status(503).json({ error: `Generic error` }).end();
//     }
// });

module.exports = router;