const internalOrderDAO = require("./DAOs/internalOrderDAO");

function internalOrderAPI(app) {

    const internalOrd = new internalOrderDAO();
    // GET
    app.get('/api/internalOrders', async (req, res) => {
        try {
            const internalOrders = await internalOrd.getInternalOrder();
            res.status(200).json(internalOrders);
        } catch (err) {
            res.status(500).json({ error: `Generic error` }).end();
        }
    });


    app.get('/api/internalOrdersIssued', async (req, res) => {
        try {
            const internalOrders = await internalOrd.getInternalOrder();
            internalOrders.filter((f) => f.state === 'ISSUED');
            res.status(200).json(internalOrders);

        } catch (err) {

        }
    });

    app.get('/api/internalOrdersAccepted', async (req, res) => {
        try {
            const internalOrders = await internalOrd.getInternalOrder();
            internalOrders.filter((f) => f.state === 'ACCEPTED');
            res.status(200).json(internalOrders);

        } catch (err) {
            res.status(500).json({ error: `Generic error` }).end();
        }
    });


    app.get('/api/internalOrders/:id', async (req, res) => {
        try {
            const id = req.params.id;
            const order = await internalOrd.getInternalOrderById(id);
            res.status(200).json(order);
        } catch (error) {
            res.status(500).json({ error: `Generic error` }).end();
        }
    });


    // POST



    app.post('/api/internalOrders', async (req, res) => {
        try {
            if (!req.body.returnOrder) return res.status(422).json({ err: 'Validation of request body failed' }).end();
            let internalOrder = req.body.internalOrder;
            if (!(internalOrder && internalOrder.issueDate & internalOrder.products))
                return res.status(422).json({ error: `Validation of request body failed` }).end();
            if (Object.entries(internalOrder).length !== 2) return res.status(422).json({ error: `Validation of request body failed` }).end();

            if (!dayjs(internalOrder.issueDate).isValid()) return res.status(422).json({ error: `Validation of request body failed` }).end();

            if (internalOrder.products.length === 0) return res.status(422).json({ error: `Validation of request body failed` }).end();

            await internalOrderDAO();
            internalOrderDAO.createInternalOrder(internalOrder);
            return res.status(201).end();
        } catch (err) {
            res.status(503).json({ error: `Generic error` }).end();
        }
    });

    // PUT

    // DELETE
    app.delete('/api/internalOrders/:id', async (req, res) => {
        let id = Number(req.params.id);
        try {
            let deletedElelements = await internalOrderDAO.deleteInternalOrder(id);
            if (deletedElelements === 0) res.status(422).json({ error: `Validation of id failed` }).end();
            res.status(204).end();
        } catch (err) {
            res.status(503).json({ error: `Generic error` }).end();
        }
    });
}

module.exports = internalOrderAPI;