const express = require('express');

const TestDescriptorService = require('../services/testDescriptorService');
const db = require('../DAOs/testDescriptorDAO');

const testDescriptorService = new TestDescriptorService(db);

const router = express.Router();

//GET
router.get('/testDescriptors', async (req, res) => {
    try {
        const testDescriptors = await testDescriptorService.getTestDescriptors();
        res.status(200).json(testDescriptors);
    } catch (err) {
        res.status(500).json({ error: `Generic error` }).end();
    }
});

router.get('/testDescriptors/:id', async (req, res) => {
    try {
        const testDescriptor = await testDescriptorService.getTestDescriptorById(req.params.id);
        if (testDescriptor === '422')
            return res.status(422).json({ error: `validation of id failed` }).end();
        if (testDescriptor === '404')
            return res.status(404).json({ error: `no test descriptor associated id` }).end();
        else
            res.status(200).json(testDescriptor);
    } catch (err) {
        res.status(500).json({ error: `Generic error` }).end();
    }
});


//POST
router.post('/testDescriptor', async (req, res) => {
    try {
        const status = await testDescriptorService.createTestDescriptor(req.body);
        if (status === '422')
            return res.status(422).json({ error: `validation of request body failed` }).end();
        if (status === '404')
            return res.status(404).json({ error: `no sku associated idSKU` }).end();
        else
            return res.status(201).end();
    } catch (err) {
        res.status(503).json({ error: `Generic error` }).end();
    }
});


// PUT
router.put('/testDescriptor/:id', async (req, res) => {
    try {
        const status = await testDescriptorService.modifyTestDescriptor(req.params.id, req.body);
        if (status === '422')
            res.status(422).json({ error: `validation of request body or of id failed` }).end();
        else if (status === '404')
            res.status(404).json({ error: `no test descriptor associated id or no sku associated to IDSku` }).end();
        else
            return res.status(200).end();
    } catch (err) {
        res.status(503).json({ error: `Generic error` }).end();
    }
});


//DELETE
router.delete('/testDescriptor/:id', async (req, res) => {
    try {
        const status = await testDescriptorService.deleteTestDescriptor(req.params.id);
        if (status === '422')
            res.status(422).json({ error: `validation of id failed` }).end();
        else
            res.status(204).end();
    } catch (err) {
        res.status(503).json({ error: `Generic error` }).end();
    }
});

router.delete('/testDescriptors', async (req, res) => {
    try {
        await testDescriptorService.deleteTestDescriptors();
        res.status(204).end();
    } catch (err) {
        res.status(503).json({ error: `Generic error` }).end();
    }
});

module.exports = router;