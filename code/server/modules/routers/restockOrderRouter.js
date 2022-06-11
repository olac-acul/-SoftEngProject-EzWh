const express = require('express');

const RestockOrderService = require('../services/restockOrderService');
const db = require('../DAOs/restockOrderDAO');

const restockOrderService = new RestockOrderService(db);

const router = express.Router();


//GET
router.get('/restockOrders', async (req, res) => {
    try {
        const orders = await restockOrderService.getRestockOrders();
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ error: `Internal Server Error` }).end();
    }
});

router.get('/restockOrdersIssued', async (req, res) => {
    try {
        const restockOrders = await restockOrderService.getRestockOrders();
        const filteredRestockORders = restockOrders.filter((f) => f.state === 'ISSUED');
        res.status(200).json(filteredRestockORders);
    } catch (err) {
        res.status(500).json({ error: `Internal Server Error` }).end();
    }
});

router.get('/restockOrders/:id', async (req, res) => {
    try {
        const RestockOrder = await restockOrderService.getRestockOrderById(req.params.id);
        if (RestockOrder === '422')
            res.status(422).json({ error: `validation of id failed` }).end();
        else if (RestockOrder === '404')
            return res.status(404).json({ error: `no restock order associated to id` }).end();
        else
            res.status(200).json(RestockOrder);
    } catch (err) {
        res.status(500).json({ error: `Internal Server Error` }).end();
    }
});

router.get('/restockOrders/:id/returnItems', async (req, res) => {
    try {
        const items = await restockOrderService.getSKUItemsToBeReturned(req.params.id);
        if (items === '422')
            res.status(422).json({ error: `validation of id failed or restock order state != COMPLETEDRETURN` }).end();
        else if (items === '404')
            return res.status(404).json({ error: `no restock order associated to id` }).end();
        else
            res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ error: `Internal Server Error` }).end();
    }
});


//POST
router.post('/restockOrder', async (req, res) => {
    try {
        const status = await restockOrderService.createRestockOrder(req.body);
        if (status === '422')
            res.status(422).json({ error: `validation of request body failed, supplier doesn't sell a product with a certain itemId or supplier itemId doesn't correspond to SKUId` }).end();
        else
            return res.status(201).end();
    } catch (err) {
        res.status(503).json({ error: `Internal Server Error` }).end();
    }
});


// PUT 
router.put('/restockOrder/:id', async (req, res) => {
    try {
        const status = await restockOrderService.changeStateRestockOrder(req.params.id, req.body);
        if (status === '422')
            res.status(422).json({ error: `validation of request body or of id failed` }).end();
        else if (status === '404')
            return res.status(404).json({ error: `no restock order associated to id` }).end();
        else
            return res.status(200).end();
    } catch (error) {
        res.status(503).json({ error: `Internal Server Entity` }).end();
    }
})

router.put('/restockOrder/:id/skuItems', async (req, res) => {
    try {
        const status = await restockOrderService.addSkuItemsList(req.params.id, req.body);
        if (status === '422')
            res.status(422).json({ error: `validation of request body or of id failed or order state != DELIVERED` }).end();
        else if (status === '404')
            return res.status(404).json({ error: `no restock order associated to id` }).end();
        else
            return res.status(200).end();
    } catch (error) {
        res.status(503).json({ error: `Service Unavailable` }).end();
    }
})

router.put('/restockOrder/:id/transportNote', async (req, res) => {
    try {
        const status = await restockOrderService.addTransportNoteRestockOrder(req.params.id, req.body);
        if (status === '422')
            res.status(422).json({ error: `validation of request body or of id failed or order state != DELIVERY or deliveryDate is before issueDate` }).end();
        else if (status === '404')
            return res.status(404).json({ error: `no restock order associated to id` }).end();
        else
            return res.status(200).end();
    } catch (error) {
        res.status(503).json({ error: `Service Unavailable` }).end();
    }
})

//DELETE
router.delete('/restockOrder/:id', async (req, res) => {
    try {
        const status = await restockOrderService.deleteRestockOrder(req.params.id);
        if (status === '422')
            res.status(422).json({ error: `validation of id failed` }).end();
        else
            res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: `Service Unavailable` }).end();
    }
});

router.delete('/restockOrders', async (req, res) => {
    try {
        await restockOrderService.deleteRestockOrders();
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: `Service Unavailable` }).end();
    }
});

module.exports = router;
