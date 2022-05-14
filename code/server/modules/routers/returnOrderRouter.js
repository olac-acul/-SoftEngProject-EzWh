const express = require('express');
const dayjs = require('dayjs');
const validator = require('validator')

const ReturnOrderService = require('../services/returnOrderService');
const db = require('../DAOs/returnOrderDAO');

const returnOrderService = new ReturnOrderService(db);

dayjs().format();
const router = express.Router();


//GET
router.get('/returnOrders', async (req, res) => {
    try {
        // 401 Unauthorized (not logged in or wrong permissions)
        const returnOrders = [];
        const orders = await returnOrderService.getReturnOrders();
        for (let i of orders) {
            let returnOrder = await returnOrderService.getReturnOrderById(i.id);
            returnOrders.push(returnOrder);
        }
        res.status(200).json(returnOrders);
    } catch (err) {
        res.status(500).json({ error: `Generic error` }).end();
    }
});

router.get('/returnOrders/:id', async (req, res) => {
    try {
        if (!validator.isNumeric(req.params.id))
            res.status(422).json({ error: `Validation of ID failed` }).end();
        const id = Number(req.params.id);
        const returnOrder = await returnOrderService.getReturnOrderById(id);
        if (returnOrder === 'Not Found')
            res.status(404).json({ error: `No return order associated to id` }).end();
        // END OF VALIDATION
        res.status(200).json(returnOrder);
    } catch (err) {
        res.status(500).json({ error: `Generic error` }).end();
    }
});


//POST
router.post('/returnOrder', async (req, res) => {
    try {
        // 401 Unauthorized (not logged in or wrong permissions)
        if (Object.keys(req.body).length !== 3)
            res.status(422).json({ error: `Validation of request body failed` }).end();
        const returnOrder = {
            returnDate: req.body.returnDate,
            products: req.body.products,
            restockOrderId: req.body.restockOrderId
        };
        if (!dayjs(returnOrder.returnDate).isValid())
            return res.status(422).json({ error: `Validation of request body failed` }).end();
        if (returnOrder.products.length == 0)
            return res.status(422).json({ error: `Validation of request body failed` }).end();
        for (i of returnOrder.products) {
            if (Object.keys(i).length !== 4)
                res.status(422).json({ error: `Validation of request body failed` }).end();
        }
        if (typeof returnOrder.restockOrderId != "number" || returnOrder.restockOrderId <= 0)
            res.status(422).json({ error: `Validation of request body failed` }).end();
        const restockOrder = await returnOrderService.getRestockOrderById(returnOrder.restockOrderId);
        if (!restockOrder)
            res.status(404).json({ error: `No restock order associated to restockOrderId` }).end();
        await returnOrderService.newReturnOrderTable();
        await returnOrderService.newReturnOrder_join_ProductTable();
        const returnOrderId = await returnOrderService.createReturnOrder(returnOrder);
        // END OF VALIDATION
        for (let i of returnOrder.products) {
            await returnOrderService.createReturnOrder_join_Product(i.SKUId, returnOrderId)
        }
        return res.status(201).end();
    } catch (err) {
        res.status(503).json({ error: `Generic error` }).end();
    }
});

//DELETE
router.delete('/returnOrder/:id', async (req, res) => {
    try {
        if (!validator.isNumeric(req.params.id))
            res.status(422).json({ error: `Validation of ID failed` }).end();
        const id = Number(req.params.id);
        // 401 Unauthorized (not logged in or wrong permissions)
        const deletedElelements = await returnOrderService.deleteReturnOrder(id);
        if (deletedElelements == 0) res.status(422).json({ error: `Validation of ID failed` }).end();
        // END OF VALIDATION
        await returnOrderService.deleteReturnOrder_join_Product(id);
        res.status(204).end();
    } catch (err) {
        res.status(503).json({ error: `Generic error` }).end();
    }
});


module.exports = router;