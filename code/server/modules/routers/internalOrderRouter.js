const express = require('express');

const InternalOrderService = require('../services/internalOrderServer');
const db = require('../DAOs/internalOrderDAO');

const internalOrderService = new InternalOrderService(db);

const router = express.Router();


// GET
router.get('/internalOrders', async (req, res) => {
    try {
        const internalOrders = await internalOrderService.getInternalOrder();
        res.status(200).json(internalOrders);
    } catch (err) {
        res.status(500).json({ error: `Internal Server Error` }).end();
    }
});


router.get('/internalOrdersIssued', async (req, res) => {
    try {
        const internalOrders = await internalOrderService.getInternalOrder();
        const filteredInternalORders = internalOrders.filter((f) => f.state === 'ISSUED');
        res.status(200).json(filteredInternalORders);

    } catch (err) {
        res.status(500).json({ error: `Internal Server Error` }).end();
    }
});

router.get('/internalOrdersAccepted', async (req, res) => {
    try {
        const internalOrders = await internalOrderService.getInternalOrder();
        const filteredInternalORders = internalOrders.filter((f) => f.state === 'ACCEPTED');
        res.status(200).json(filteredInternalORders);

    } catch (err) {
        res.status(500).json({ error: `Internal Server Error` }).end();
    }
});


router.get('/internalOrders/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (id <= 0)
            res.status(422).json({ error: 'Unprocessable Entity' });
        const order = await internalOrderService.getInternalOrderById(id);
        if (order === 'not found')
            res.status(404).json({ error: 'NOt Found' }).end();
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: `Internal Server Error` }).end();
    }
});


// POST



router.post('/internalOrders', async (req, res) => {
    try {
        if (!req.body) return res.status(422).json({ err: 'Validation of request body failed' }).end();
        let internalOrder = req.body;
        // if (!(internalOrder && internalOrder.issueDate && internalOrder.products))
        //     return res.status(422).json({ error: `Validation of request body failed` }).end();
        // if (Object.entries(internalOrder).length !== 1) return res.status(422).json({ error: `Validation of request body failed` }).end();

        if (!dayjs(internalOrder.issueDate).isValid()) return res.status(422).json({ error: `Validation of request body failed` }).end();

        //if (internalOrder.products.length === 0) return res.status(422).json({ error: `Validation of request body failed` }).end();
        let intOrd =
        {
            issueDate: internalOrder.issueDate,
            state: "ISSUED",
            customerId: internalOrder.customerId
        }
        // await internalOrderDAO();
        await internalOrderService.createInternalOrder(intOrd);
        await internalOrderService.changeStateInternalOrder(req.body.newState, id);
        for (j of req.body.products) {
            await internalOrderService.createJoinProduct(j);
        }
        return res.status(201).end();
    } catch (err) {
        res.status(503).json({ error: `Service Unavailable` }).end();
    }
});

// PUT

router.put('/internalOrders/:id', async (req, res) => {
    try {
        let id = Number(req.params.id);

        if (id <= 0)
            res.status(422).json({ error: 'Unprocessable Entity' });
        const order = await internalOrderService.getInternalOrderById(id);
        if (order === 'not found')
            res.status(404).json({ error: 'Not Found' }).end();

        if (req.body.newState === "COMPLETED") {
            for (j of req.body.products) {
                await internalOrderService.createJoinProduct(j);
            }
        }

    } catch (error) {
        res.status(503).json({ error: `Service Unavailable` }).end();
    }

})

// DELETE
router.delete('/internalOrders/:id', async (req, res) => {
    let id = Number(req.params.id);
    try {
        let deletedElelements = await internalOrderService.deleteInternalOrder(id);
        await internalOrderService.deleteJoinProduct(id);
        if (deletedElelements === 0) res.status(422).json({ error: `Validation of id failed` }).end();
        res.status(204).end();
    } catch (err) {
        res.status(503).json({ error: `Service Unavailable` }).end();
    }
});

module.exports = router;
