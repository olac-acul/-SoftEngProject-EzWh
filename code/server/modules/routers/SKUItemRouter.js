const express = require('express');

const SKUItemService = require('../services/SKUItemService');
const db = require('../DAOs/SKUItemDAO');

const skuItemService = new SKUItemService(db);

const router = express.Router();


// GET
router.get('/skuitems', async (req, res) => {
    try {
        const SKUItems = await skuItemService.getAllSKUItems();
        // END OF VALIDATION
        res.status(200).json(SKUItems);
    } catch (err) {
        res.status(500).json({ error: `Generic error` }).end();
    }
});

router.get('/skuitems/sku/:id', async (req, res) => {
    try {
        const id = req.params.id;
        // 422 Unprocessable Entity
        if (!id) return res.status(422).json({ error: `Validation of ID failed` }).end();
        const SKUItems = await skuItemService.getAllAvailableSKUItems(id);
        // 404 Not Found
        if (!SKUItems) return res.status(404).json({ error: `No SKU associated to ID` }).end();
        // END OF VALIDATION
        res.status(200).json(SKUItems);
    } catch (err) {
        res.status(500).json({ error: `Generic error` }).end();
    }
});

router.get('/skuitems/:rfid', async (req, res) => {
    try {
        const RFID = req.params.rfid;
        // 422 Unprocessable Entity
        if (!RFID) return res.status(422).json({ error: `Validation of RFID failed` }).end();
        const SKUItem = await skuItemService.getSKUItem(RFID);
        // 404 Not Found
        if (!RFID) return res.status(404).json({ error: `No SKU associated to RFID` }).end();
        // END OF VALIDATION
        res.status(200).json(SKUItem);
    } catch (err) {
        res.status(500).json({ error: `Generic error` }).end();
    }
});


// POST
router.post('/skuitem', async (req, res) => {
    try {
        // 422 Unprocessable Entity
        if (!req.body) return res.status(422).json({ error: `Validation of request body failed` }).end();
        const SKUItem = req.body;
        if (!(SKUItem.RFID && SKUItem.SKUId)) return res.status(422).json({ error: `Validation of request body failed` }).end();
        // 404 Not Found

        // END OF VALIDATION
        await skuItemService.addSKUItem(SKUItem);
        return res.status(201).end();

    } catch (err) {
        res.status(503).json({ error: `Generic error` }).end();
    }
});


// PUT
router.put('/skuitems/:rfid', async (req, res) => {
    try {
        const oldRFID = req.params.rfid;
        const newRFID = req.body.newRFID;
        const newAvailable = req.body.newAvailable;
        const newDateOfStock = req.body.newDateOfStock;
        updatedElements = await skuItemService.modifySKUItem(oldRFID, newRFID, newAvailable, newDateOfStock);
        if (updatedElements === 0) return res.status(404).json({ error: `No SKU Item associated to RFID` }).end();
        return res.status(200).end();
    } catch (err) {
        res.status(503).json({ error: `Generic error` }).end();
    }
});


//DELETE
router.delete('/skuitems/:rfid', async (req, res) => {
    try {
        const RFID = req.params.rfid;
        const deletedSKUItems = await skuItemService.deleteSKUItem(RFID);
        // Check id validation
        if (deletedSKUItems === 0) res.status(422).json({ error: `Validation of RFID failed` }).end();
        // END OF VALIDATION
        res.status(204).end();
    } catch (err) {
        res.status(503).json({ error: `Generic error` }).end();
    }
});

module.exports = router;