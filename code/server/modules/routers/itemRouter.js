const express = require('express');

const ItemService = require('../services/itemService');
const db = require('../DAOs/itemDAO');

const itemService = new ItemService(db);

const router = express.Router();


//GET
router.get('/items', async (req, res) => {
    try {
        const items = await itemService.getItems();
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ error: `Generic error` }).end();
    }
});


router.get('/items/:id/:supplierId', async (req, res) => {
    try {
        const item = await itemService.getItemById(req.params.id, req.params.supplierId);
        if (item === '422')
            res.status(422).json({ error: `Validation of ID failed` }).end();
        else if (item === '404')
            res.status(404).json({ error: `No item associated to ID` }).end();
        else
            res.status(200).json(item);
    } catch (err) {
        res.status(500).json({ error: `Generic error` }).end();
    }
});


//POST
router.post('/item', async (req, res) => {
    try {
        const status = await itemService.createItem(req.body);
        if (status === '422')
            res.status(422).json({ error: `Validation of request body failed or this supplier already sells an item with the same SKUId or supplier already sells an Item with the same ID` }).end();
        else if (status === '404')
            res.status(404).json({ error: `SKU not found` }).end();
        else
            return res.status(201).end();
    } catch (err) {
        res.status(503).json({ error: `Generic error` }).end();
    }
});


// PUT
router.put('/item/:id/:supplierId', async (req, res) => {
    try {
        const status = await itemService.modifyItem(req.params.id, req.params.supplierId, req.body);
        if (status === '422')
            res.status(422).json({ error: `Validation of request body failed` }).end();
        else if (status === '404')
            res.status(404).json({ error: `Item not existing` }).end();
        else
            return res.status(200).end();
    } catch (err) {
        res.status(503).json({ error: `Generic error` }).end();
    }
});


//DELETE
router.delete('/items/:id/:supplierId', async (req, res) => {
    try {
        const status = await itemService.deleteItem(req.params.id, req.params.supplierId);
        if (status === '422')
            res.status(422).json({ error: `validation of id failed` }).end();
        else
            res.status(204).end();
    } catch (err) {
        res.status(503).json({ error: `Generic error` }).end();
    }
});

router.delete('/itemsAll', async (req, res) => {
    try {
        itemService.deleteItems();
        res.status(204).end();
    } catch (err) {
        res.status(503).json({ error: `Generic error` }).end();
    }
});

module.exports = router;