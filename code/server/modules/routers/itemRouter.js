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


router.get('/items/:id', async (req, res) => {
    let id = Number(req.params.id);
    try {
        const item = await itemService.getItemById(id);
        // Check validation of id
        if (item === 'Not Found') res.status(404).json({ error: `No item associated to id` }).end();
        // 422 Unprocessable Entity (validation of id failed)
        // END OF VALIDATION
        res.status(200).json(item);
    } catch (err) {
        res.status(500).json({ error: `Generic error` }).end();
    }
});


//POST
router.post('/item', async (req, res) => {
    try {
        // Check validation of request body
        if (!req.body) return res.status(422).json({ error: `Validation of request body failed` }).end();
        let item = req.body;
        if (!(item && item.id && item.description && item.price && item.SKUId && item.supplierId))
            return res.status(422).json({ error: `Validation of request body failed` }).end();
        // Check number of elements of the request 
        if (Object.entries(item).length !== 5) return res.status(422).json({ error: `Validation of request body failed` }).end();
        // Check positionID type
        // END OF VALIDATION
        await itemService.createItem(item);
        return res.status(201).end();

    } catch (err) {
        res.status(503).json({ error: `Generic error` }).end();
    }
});


//DELETE
router.delete('/items/:id', async (req, res) => {
    let id = Number(req.params.id);
    try {
        let deletedElelements = await itemService.deleteItem(id);
        // Check id validation
        if (deletedElelements === 0) res.status(422).json({ error: `Validation of id failed` }).end();
        // END OF VALIDATION
        res.status(204).end();
    } catch (err) {
        res.status(503).json({ error: `Generic error` }).end();
    }
});

module.exports = router;