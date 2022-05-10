function RestockOrderAPIs(app) {
    const dayjs = require('dayjs');
    const RestockOrderDAO = require('./DAOs/restockOrderDAO');

    dayjs().format();
    const restockOrderDAO = new restockOrderDAO();

    //GET
    app.get('/api/RestockOrders', async (req, res) => {
        try {
            // 401 Unauthorized (not logged in or wrong permissions)
            const RestockOrders = [];
            const orders = await restockOrderDAO.getRestockOrders();
            for (let i of orders) {
                let RestockOrder = await restockOrderDAO.getRestockOrderById(i.id);
                RestockOrders.push(RestockOrder);
            }
            res.status(200).json(RestockOrders);
        } catch (err) {
            res.status(500).json({ error: `Generic error` }).end();
        }
    });

    app.get('/api/restockOrdersIssued', async (req, res) => {
        try {
            const RestockOrders = [];
            const orders = await restockOrderDAO.getRestockOrdersIssued();
            for (let i of orders) {
                let RestockOrder = await restockOrderDAO.getRestockOrderById(i.id);
                RestockOrders.push(RestockOrder);
            }
        } catch (err) {
            res.status(500).json({ error: `Generic error` }).end();
        }
    });

    app.get('/api/RestockOrders/:id', async (req, res) => {
        let id = Number(req.params.id);
        try {
            // 401 Unauthorized (not logged in or wrong permissions)
            const RestockOrder = await restockOrderDAO.getRestockOrderById(id);
            // Check validation of id
            if (RestockOrder === 'Not Found') res.status(404).json({ error: `No Restock order associated to id` }).end();
            // 422 Unprocessable Entity (validation of id failed)
            // END OF VALIDATION
            res.status(200).json(RestockOrder);
        } catch (err) {
            res.status(500).json({ error: `Generic error` }).end();
        }
    });

    //POST
    app.post('/api/RestockOrder', async (req, res) => {
        try {
            // 401 Unauthorized (not logged in or wrong permissions)
            // Check validation of request body
            if (!req.body.RestockOrder) return res.status(422).json({ error: `Validation of request body failed` }).end();
            let RestockOrder = req.body.RestockOrder;
            // if (!(RestockOrder && RestockOrder.RestockDate && RestockOrder.products && RestockOrder.restockOrderId))
            //     Restock res.status(422).json({ error: `Validation of request body failed` }).end();
            // Check number of elements of the request 
            if (Object.entries(RestockOrder).length !== 3) return res.status(422).json({ error: `Validation of request body failed` }).end();
            // Check date validation
            if (!dayjs(RestockOrder.RestockDate).isValid()) return res.status(422).json({ error: `Validation of request body failed` }).end();
            // Check length of the list of products
            // if (RestockOrder.products.length === 0) Restock res.status(422).json({ error: `Validation of request body failed` }).end();
            // Check products type
            // Check restockOrderId type
            // 404 Not Found (no restock order associated to restockOrderId)
            // END OF VALIDATION
            await restockOrderDAO.newRestockOrderTable();
            await restockOrderDAO.newRestockOrder_join_ProductTable();
            let RestockOrderId = await restockOrderDAO.createRestockOrder(RestockOrder);
            for (let i of RestockOrder.products) {
                await restockOrderDAO.createRestockOrder_join_Product(i.SKUId, RestockOrderId)
            }
            // revert in case if order created but join not
            return res.status(201).end();

        } catch (err) {
            res.status(503).json({ error: `Generic error` }).end();
        }
    });

    // PUT 
    app.put('/api/restockOrder/:id', async (req, res) => {
        //Change state to delivered given a id
    })

    app.put('/api/restockOrder/:id/skuItems', async (req, res) => {
        // add a non Empty list of skuitems to the given restockOrder
    })

    app.put('/api/restockOrder/:id/transportNote', async (req, res) => {
        // add a transport Note
    })

    //DELETE
    app.delete('/api/RestockOrder/:id', async (req, res) => {
        let id = Number(req.params.id);
        try {
            // 401 Unauthorized (not logged in or wrong permissions)
            let deletedElelements = await restockOrderDAO.deleteRestockOrder(id);
            let deletedJoins = await restockOrderDAO.deleteRestockOrder_join_Product(id);
            // Check id validation
            if (deletedElelements === 0 || deletedJoins === 0) res.status(422).json({ error: `Validation of id failed` }).end();
            // END OF VALIDATION
            res.status(204).end();
        } catch (err) {
            res.status(503).json({ error: `Generic error` }).end();
        }
    });

}

module.exports = RestockOrderAPIs;