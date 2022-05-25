const express = require('express');

const SKUItemService = require('../services/SKUItemService');
const db = require('../DAOs/SKUItemDAO');

const skuItemService = new SKUItemService(db);

const router = express.Router();


// GET
router.get('/skuitems', async (req, res) => {
    try {
        const SKUItems = await skuItemService.getAllSKUItems();
        res.status(200).json(SKUItems);
    } catch (err) {
        res.status(500).json({ error: `Generic error` }).end();
    }
});

router.get('/skuitems/sku/:id', async (req, res) => {
    try {
        const SKUItems = await skuItemService.getAllAvailableSKUItems(req.params.id);
        if (SKUItems === '422')
            res.status(422).json({ error: `Validation of ID failed` }).end();
        else if (SKUItems === '404')
            return res.status(404).json({ error: `No SKU associated to ID` }).end();
        else
            res.status(200).json(SKUItems);
    } catch (err) {
        res.status(500).json({ error: `Generic error` }).end();
    }
});

router.get('/skuitems/:rfid', async (req, res) => {
    try {
        const SKUItem = await skuItemService.getSKUItem(req.params.rfid);
        if (SKUItem === '422')
            res.status(422).json({ error: `Validation of RFID failed` }).end();
        else if (SKUItem === '404')
            return res.status(404).json({ error: `No SKU Item associated to RFID` }).end();
        else
            res.status(200).json(SKUItem);
    } catch (err) {
        res.status(500).json({ error: `Generic error` }).end();
    }
});


// POST
router.post('/skuitem', async (req, res) => {
    try {
        const status = await skuItemService.addSKUItem(req.body);
        if (status === '422')
            res.status(422).json({ error: `Validation of request body failed` }).end();
        else if (status === '404')
            return res.status(404).json({ error: `No SKU associated to SKUId` }).end();
        else
            return res.status(201).end();
    } catch (err) {
        res.status(503).json({ error: `Generic error` }).end();
    }
});


// PUT
router.put('/skuitems/:rfid', async (req, res) => {
    try {
        updatedElements = await skuItemService.modifySKUItem(req.params.rfid, req.body);
        if (updatedElements === '422')
            res.status(422).json({ error: `Validation of request body or of RFID failed` }).end();
        else if (updatedElements === 0)
            return res.status(404).json({ error: `No SKU Item associated to RFID` }).end();
        else
            return res.status(200).end();
    } catch (err) {
        res.status(503).json({ error: `Generic error` }).end();
    }
});


//DELETE
router.delete('/skuitems/:rfid', async (req, res) => {
    try {
        const deletedSKUItems = await skuItemService.deleteSKUItem(req.params.rfid);
        if (deletedSKUItems === '422')
            res.status(422).json({ error: `Validation of RFID failed` }).end();
        else
            res.status(204).end();
    } catch (err) {
        res.status(503).json({ error: `Generic error` }).end();
    }
});

router.delete('/skuitemsAll', async (req, res) => {
    try {
        await skuItemService.deleteSKUItems();
        res.status(204).end();
    } catch (err) {
        res.status(503).json({ error: `Generic error` }).end();
    }
});

module.exports = router;