const express = require('express');

const ReturnOrderService = require('../services/returnOrderService');
const db = require('../DAOs/returnOrderDAO');

const returnOrderService = new ReturnOrderService(db);

const router = express.Router();


//GET
router.get('/returnOrders', async (req, res) => {
    try {
        const returnOrders = await returnOrderService.getReturnOrders();
        res.status(200).json(returnOrders);
    } catch (err) {
        res.status(500).json({ error: `Generic error` }).end();
    }
});

router.get('/returnOrders/:id', async (req, res) => {
    try {
        const status = await returnOrderService.getReturnOrderById(req.params.id);
        if (status === '422')
            return res.status(422).json({ error: `validation of id failed` }).end();
        else if (status === '404')
            return res.status(404).json({ error: `no return order associated to id` }).end();
        else
            res.status(200).json(status);
    } catch (err) {
        res.status(500).json({ error: `Generic error` }).end();
    }
});


//POST
router.post('/returnOrder', async (req, res) => {
    try {
        // const restockOrder = await returnOrderService.getRestockOrderById(req.body.restockOrderId);
        // if (restockOrder === '422')
        //     return res.status(422).json({ error: `Validation of request body failed` }).end();
        // if (restockOrder === '404')
        //     res.status(404).json({ error: `No restock order associated to restockOrderId` }).end();
        // for (let i of req.body.products) {
        //     const item = await returnOrderService.getItemById(i.SKUId);
        //     if (item === '404')
        //         return res.status(422).json({ error: `Validation of request body failed` }).end();
        // }
        const returnOrder = req.body;
        const returnOrderId = await returnOrderService.createReturnOrder(returnOrder);
        if (returnOrderId === '422')
            return res.status(422).json({ error: `Validation of request body failed` }).end();
        if (returnOrderId === '404')
            res.status(404).json({ error: `No restock order associated to restockOrderId` }).end();    
        for (let i of returnOrder.products) {
            // Better to check SKUID
            // await returnOrderService.createReturnOrder_join_Product(i.SKUId, returnOrderId)
            await returnOrderService.createReturnOrder_join_Product(i, returnOrderId)
        }
        return res.status(201).end();
    } catch (err) {
        res.status(503).json({ error: `Generic error` }).end();
    }
});

//DELETE
router.delete('/returnOrder/:id', async (req, res) => {
    try {
        const status = await returnOrderService.deleteReturnOrder(req.params.id);
        if (status === '422')
            return res.status(422).json({ error: `Validation of ID failed` }).end();
        res.status(204).end();
    } catch (err) {
        res.status(503).json({ error: `Generic error` }).end();
    }
});

router.delete('/returnOrders', async (req, res) => {
    try {
        await returnOrderService.deleteReturnOrders();
        res.status(204).end();
    } catch (err) {
        res.status(503).json({ error: `Generic error` }).end();
    }
});


module.exports = router;