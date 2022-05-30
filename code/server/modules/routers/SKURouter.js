const express = require('express');

const SKUService = require('../services/SKUService');
const db = require('../DAOs/SKUDAO');

const skuService = new SKUService(db);

const router = express.Router();

// GET
router.get('/skus', async (req, res) => {
    try {
        const SKUs = await skuService.getAllSKUs();
        res.status(200).json(SKUs);
    } catch (err) {
        res.status(500).json({ error: `Generic error` }).end();
    }
});

router.get('/skus/:id', async (req, res) => {
    try {
        const SKU = await skuService.getSKU(req.params.id);
        if (SKU === '422')
            res.status(422).json({ error: `validation of id failed` }).end();
        else if (SKU === '404')
            return res.status(404).json({ error: `no SKU associated to id` }).end();
        else
            res.status(200).json(SKU);
    } catch (err) {
        res.status(500).json({ error: `Generic error` }).end();
    }
});

// POST
router.post('/sku', async (req, res) => {
    try {
        const status = await skuService.addSKU(req.body);
        if (status === '422')
            res.status(422).json({ error: `validation of request body failed` }).end();
        else
            return res.status(201).end();

    } catch (err) {
        res.status(503).json({ error: `Generic error` }).end();
    }
});

// PUT
router.put('/sku/:id', async (req, res) => {
    try {
        const status = await skuService.modifySKU(req.params.id, req.body);
        if (status === '422')
            res.status(422).json({ error: `validation of request body failed or if with newAvailableQuantity position is not capable enough in weight or in volume` }).end();
        else if (status === '404')
            return res.status(404).json({ error: `SKU not existing` }).end();
        else
            res.status(200).end();
    } catch (error) {
        res.status(503).json({ error: `Service Unavailable` }).end();
    }

});

router.put('/sku/:id/position', async (req, res) => {
    try {
        const status = await skuService.modifySKUPosition(req.params.id, req.body);
        if (status === '422')
            res.status(422).json({ error: `validation of position through the algorithm failed or position isn't capable to satisfy volume and weight constraints for available quantity of sku or position is already assigned to a sku` }).end();
        else if (status === '404')
            return res.status(404).json({ error: `Position not existing or SKU not existing` }).end();
        else
            res.status(200).end();
    } catch (error) {
        res.status(503).json({ error: `Service Unavailable` }).end();
    }

});

//DELETE
router.delete('/skus/:id', async (req, res) => {
    try {
        const status = await skuService.deleteSKU(req.params.id);
        if (status === '422')
            res.status(422).json({ error: `validation of id failed` }).end();
        else
            res.status(204).end();
    } catch (err) {
        res.status(503).json({ error: `Generic error` }).end();
    }
});

router.delete('/skusAll', async (req, res) => {
    try {
        await skuService.deleteSKUs();
        res.status(204).end();
    } catch (err) {
        res.status(503).json({ error: `Generic error` }).end();
    }
});

module.exports = router;