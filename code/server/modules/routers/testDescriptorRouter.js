const express = require('express');

const TestDescriptorService = require('../services/testDescriptorService');
const db = require('../DAOs/testDescriptorDAO');

const testDescriptorService = new TestDescriptorService(db);

const router = express.Router();


//GET
router.get('/testDescriptors', async (req, res) => {
    try {
        // 401 Unauthorized (not logged in or wrong permissions)
        const testDescriptors = await testDescriptorService.getTestDescriptors();
        res.status(200).json(testDescriptors);
    } catch (err) {
        res.status(500).json({ error: `Generic error` }).end();
    }
});


router.get('/testDescriptors/:id', async (req, res) => {
    let id = Number(req.params.id);
    try {
        // 401 Unauthorized (not logged in or wrong permissions)
        const testDescriptor = await testDescriptorService.getTestDescriptorById(id);
        // Check validation of id
        if (testDescriptor === 'Not Found') res.status(404).json({ error: `No test descriptor associated to id` }).end();
        // 422 Unprocessable Entity (validation of id failed)
        // END OF VALIDATION
        res.status(200).json(testDescriptor);
    } catch (err) {
        res.status(500).json({ error: `Generic error` }).end();
    }
});


//POST
router.post('/testDescriptor', async (req, res) => {
    try {
        // 401 Unauthorized (not logged in or wrong permissions)
        // Check validation of request body
        if (!req.body) return res.status(422).json({ error: `Validation of request body failed` }).end();
        let testDescriptor = req.body;
        if (!(testDescriptor && testDescriptor.name && testDescriptor.procedureDescription && testDescriptor.idSKU))
            return res.status(422).json({ error: `Validation of request body failed` }).end();
        // Check number of elements of the request 
        if (Object.entries(testDescriptor).length !== 3) return res.status(422).json({ error: `Validation of request body failed` }).end();
        // Check positionID type
        // END OF VALIDATION
        await testDescriptorService.createTestDescriptor(testDescriptor);
        return res.status(201).end();

    } catch (err) {
        res.status(503).json({ error: `Generic error` }).end();
    }
});


//DELETE
router.delete('/testDescriptor/:id', async (req, res) => {
    let id = Number(req.params.id);
    try {
        // 401 Unauthorized (not logged in or wrong permissions)
        let deletedElelements = await testDescriptorService.deleteTestDescriptor(id);
        // Check id validation
        if (deletedElelements === 0) res.status(422).json({ error: `Validation of id failed` }).end();
        // END OF VALIDATION
        res.status(204).end();
    } catch (err) {
        res.status(503).json({ error: `Generic error` }).end();
    }
});

module.exports = router;