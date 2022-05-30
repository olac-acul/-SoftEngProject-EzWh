const express = require('express');

const InternalOrderService = require('../services/internalOrderService');
const db = require('../DAOs/internalOrderDAO');

const internalOrderService = new InternalOrderService(db);

const router = express.Router();


// GET
router.get('/internalOrders', async (req, res) => {
    try {
        const internalOrders = await internalOrderService.getInternalOrders();
        res.status(200).json(internalOrders);
    } catch (err) {
        res.status(500).json({ error: `Internal Server Error` }).end();
    }
});

router.get('/internalOrdersIssued', async (req, res) => {
    try {
        const internalOrders = await internalOrderService.getInternalOrders();
        const filteredInternalORders = internalOrders.filter((f) => f.state === 'ISSUED');
        res.status(200).json(filteredInternalORders);

    } catch (err) {
        res.status(500).json({ error: `Internal Server Error` }).end();
    }
});

router.get('/internalOrdersAccepted', async (req, res) => {
    try {
        const internalOrders = await internalOrderService.getInternalOrders();
        const filteredInternalOrders = internalOrders.filter((f) => f.state === 'ACCEPTED');
        res.status(200).json(filteredInternalOrders);

    } catch (err) {
        res.status(500).json({ error: `Internal Server Error` }).end();
    }
});

router.get('/internalOrders/:id', async (req, res) => {
    try {
        const order = await internalOrderService.getInternalOrderById(req.params.id);
        if (order === '422')
            res.status(422).json({ error: `validation of id failed` }).end();
        else if (order === '404')
            return res.status(404).json({ error: `no internal order associated to id` }).end();
        else
            res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: `Internal Server Error` }).end();
    }
});


// POST
router.post('/internalOrders', async (req, res) => {
    try {
        const status = await internalOrderService.createInternalOrder(req.body);
        if (status === '422')
            res.status(422).json({ error: `validation of request body failed` }).end();
        else
            return res.status(201).end();
    } catch (err) {
        res.status(503).json({ error: `Service Unavailable` }).end();
    }
});


// PUT
router.put('/internalOrders/:id', async (req, res) => {
    try {
        const status = await internalOrderService.changeStateInternalOrder(req.params.id, req.body);
        if (status === '422')
            res.status(422).json({ error: `validation of request body or of id failed` }).end();
        else if (status === '404')
            return res.status(404).json({ error: `no internal order associated to id` }).end();
        else
            res.status(200).end();
    } catch (error) {
        res.status(503).json({ error: `Service Unavailable` }).end();
    }

})


// DELETE
router.delete('/internalOrders/:id', async (req, res) => {
    try {
        const status = await internalOrderService.deleteInternalOrder(req.params.id);
        if (status === '422')
            res.status(422).json({ error: `validation of id failed` }).end();
        else
            res.status(204).end();
    } catch (err) {
        res.status(503).json({ error: `Service Unavailable` }).end();
    }
});

router.delete('/internalOrdersAll', async (req, res) => {
    try {
        await internalOrderService.deleteInternalOrders(); 
        res.status(204).end();
    } catch (err) {
        res.status(503).json({ error: `Service Unavailable` }).end();
    }
});

module.exports = router;
