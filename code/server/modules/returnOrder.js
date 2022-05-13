function ReturnOrderAPIs(app) {
    const dayjs = require('dayjs');
    const validator = require('validator')
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
        try {
            if (!validator.isNumeric(req.params.id))
                res.status(422).json({ error: `Validation of ID failed` }).end();
            const id = Number(req.params.id);
            const returnOrder = await returnOrderDAO.getReturnOrderById(id);
            if (returnOrder === 'Not Found')
                res.status(404).json({ error: `No return order associated to id` }).end();
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
            if (typeof (returnOrder.restockOrderId) !== Number || returnOrder.restockOrderId <= 0)
                res.status(422).json({ error: `Validation of request body failed` }).end();
            // 404 Not Found (no restock order associated to restockOrderId)
            // END OF VALIDATION
            // await returnOrderDAO.newReturnOrderTable();
            // await returnOrderDAO.newReturnOrder_join_ProductTable();
            // const returnOrderId = await returnOrderDAO.createReturnOrder(returnOrder);
            // for (let i of returnOrder.products) {
            //     await returnOrderDAO.createReturnOrder_join_Product(i.SKUId, returnOrderId)
            // }
            // revert in case if order created but join not
            return res.status(201).end();
        } catch (err) {
            res.status(503).json({ error: `Generic error` }).end();
        }
    });

    //DELETE
    app.delete('/api/returnOrder/:id', async (req, res) => {
        try {
            const id = Number(req.params.id);
            // 401 Unauthorized (not logged in or wrong permissions)
            const deletedElelements = await returnOrderDAO.deleteReturnOrder(id);
            const deletedJoins = await returnOrderDAO.deleteReturnOrder_join_Product(id);
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