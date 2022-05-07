function ReturnOrderAPIs(app) {
    const dayjs = require('dayjs');
    const ReturnOrderDAO = require('./DAOs/returnOrderDAO');

    dayjs().format();
    const returnOrderDAO = new ReturnOrderDAO();

    //GET
    app.get('/api/returnOrders', async (req, res) => {
        try {
            // 401 Unauthorized (not logged in or wrong permissions)
            const returnOrders = [];
            const orders = await returnOrderDAO.getReturnOrders();
            for (let i of orders) {
                let returnOrder = await returnOrderDAO.getReturnOrderById(i.id);
                returnOrders.push(returnOrder);
            }
            res.status(200).json(returnOrders);
        } catch (err) {
            res.status(500).json({ error: `Generic error` }).end();
        }
    });

    app.get('/api/returnOrders/:id', async (req, res) => {
        let id = Number(req.params.id);
        try {
            // 401 Unauthorized (not logged in or wrong permissions)
            const returnOrder = await returnOrderDAO.getReturnOrderById(id);
            // Check validation of id
            if (returnOrder === 'Not Found') res.status(404).json({ error: `No return order associated to id` }).end();
            // 422 Unprocessable Entity (validation of id failed)
            // END OF VALIDATION
            res.status(200).json(returnOrder);
        } catch (err) {
            res.status(500).json({ error: `Generic error` }).end();
        }
    });

    //POST
    app.post('/api/returnOrder', async (req, res) => {
        try {
            // 401 Unauthorized (not logged in or wrong permissions)
            // Check validation of request body
            if (!req.body.returnOrder) return res.status(422).json({ error: `Validation of request body failed` }).end();
            let returnOrder = req.body.returnOrder;
            // if (!(returnOrder && returnOrder.returnDate && returnOrder.products && returnOrder.restockOrderId))
            //     return res.status(422).json({ error: `Validation of request body failed` }).end();
            // Check number of elements of the request 
            if (Object.entries(returnOrder).length !== 3) return res.status(422).json({ error: `Validation of request body failed` }).end();
            // Check date validation
            if (!dayjs(returnOrder.returnDate).isValid()) return res.status(422).json({ error: `Validation of request body failed` }).end();
            // Check length of the list of products
            // if (returnOrder.products.length === 0) return res.status(422).json({ error: `Validation of request body failed` }).end();
            // Check products type
            // Check restockOrderId type
            // 404 Not Found (no restock order associated to restockOrderId)
            // END OF VALIDATION
            await returnOrderDAO.newReturnOrderTable();
            await returnOrderDAO.newReturnOrder_join_ProductTable();
            let returnOrderId = await returnOrderDAO.createReturnOrder(returnOrder);
            for (let i of returnOrder.products) {
                await returnOrderDAO.createReturnOrder_join_Product(i.SKUId, returnOrderId)
            }
            // revert in case if order created but join not
            return res.status(201).end();

        } catch (err) {
            res.status(503).json({ error: `Generic error` }).end();
        }
    });

    //DELETE
    app.delete('/api/returnOrder/:id', async (req, res) => {
        let id = Number(req.params.id);
        try {
            // 401 Unauthorized (not logged in or wrong permissions)
            let deletedElelements = await returnOrderDAO.deleteReturnOrder(id);
            let deletedJoins = await returnOrderDAO.deleteReturnOrder_join_Product(id);
            // Check id validation
            if (deletedElelements === 0 || deletedJoins === 0) res.status(422).json({ error: `Validation of id failed` }).end();
            // END OF VALIDATION
            res.status(204).end();
        } catch (err) {
            res.status(503).json({ error: `Generic error` }).end();
        }
    });

}

module.exports = ReturnOrderAPIs;