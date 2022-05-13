function RestockOrderAPIs(app) {
    const dayjs = require('dayjs');
    const RestockOrderDAO = require('./DAOs/restockOrderDAO');

    dayjs().format();
    const restockOrd = new RestockOrderDAO();

    //GET
    app.get('/api/restockOrders', async (req, res) => {
        try {
            // 401 Unauthorized (not logged in or wrong permissions)
            const orders = await restockOrd.getRestockOrders();
            res.status(200).json(orders);
        } catch (err) {
            res.status(500).json({ error: `Internal Server Error` }).end();
        }
    });

    app.get('/api/restockOrdersIssued', async (req, res) => {
        try {
            const orders = await restockOrd.getRestockOrdersIssued();
            const restockOrdersIssued = [];
            for (ord of orders) {
                if (ord.state === "ISSUED")
                    restockOrdersIssued.push(ord);
            }
            resolve(restockOrdersIssued);
        } catch (err) {
            res.status(500).json({ error: `Internal Server Error` }).end();
        }
    });

    app.get('/api/restockOrders/:id', async (req, res) => {
        let id = Number(req.params.id);
        try {
            // 401 Unauthorized (not logged in or wrong permissions)
            const RestockOrder = await restockOrd.getRestockOrderById(id);
            // Check validation of id
            if (RestockOrder === 'Not Found') res.status(404).json({ error: `No Restock order associated to id` }).end();
            // 422 Unprocessable Entity (validation of id failed)
            // END OF VALIDATION
            res.status(200).json(RestockOrder);
        } catch (err) {
            res.status(500).json({ error: `Internal Server Error` }).end();
        }
    });

    //POST
    app.post('/api/restockOrder', async (req, res) => {
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
            await restockOrd.newRestockOrderTable();
            await restockOrd.newRestockOrder_join_ProductTable();
            let RestockOrderId = await restockOrd.createRestockOrder(RestockOrder);
            for (let i of RestockOrder.products) {
                await restockOrd.createRestockOrder_join_Product(i.SKUId, RestockOrderId)
            }
            // revert in case if order created but join not
            return res.status(201).end();

        } catch (err) {
            res.status(503).json({ error: `Internal Server Error` }).end();
        }
    });

    // PUT 
    app.put('/api/restockOrder/:id', async (req, res) => {
        try {
            let id = Number(req.params.id);

            if (id <= 0)
                res.status(422).json({ error: 'Unprocessable Entity' });
            const order = await restockOrd.getRestockOrderById(id);
            if (order === 'not found')
                res.status(404).json({ error: 'Not Found' }).end();

            await restockOrd.changeStateRestockOrder(id, req.body.newState);
        } catch (error) {
            res.status(503).json({ error: `Internal Server Entity` }).end();
        }
    })

    app.put('/api/restockOrder/:id/skuItems', async (req, res) => {
        try {
            let id = Number(req.params.id);

            if (id <= 0)
                res.status(422).json({ error: 'Unprocessable Entity' });
            const order = await restockOrd.getRestockOrderById(id);
            if (order === 'not found')
                res.status(404).json({ error: 'Not Found' }).end();

            if (req.body.newState === "COMPLETED") {

            }
            await restockOrd.addSkuItemsList(req.body.skuItems, id);
        } catch (error) {
            res.status(503).json({ error: `Service Unavailable` }).end();
        }
    })

    app.put('/api/restockOrder/:id/transportNote', async (req, res) => {
        try {
            let id = Number(req.params.id);

            if (id <= 0)
                res.status(422).json({ error: 'Unprocessable Entity' });
            const order = await restockOrd.getInternalRestockById(id);
            if (order === 'not found')
                res.status(404).json({ error: 'Not Found' }).end();
            await restockOrd.addTransportNoteRestockOrder(id, req.body.transportNote.deliveryDate)
            if (req.body.newState === "COMPLETED") {

            }
            await restockOrd.addTransportNoteRestockOrder(req.body.transportNote, id);
        } catch (error) {
            res.status(503).json({ error: `Service Unavailable` }).end();
        }
    })

    //DELETE
    app.delete('/api/restockOrder/:id', async (req, res) => {
        let id = Number(req.params.id);
        try {
            // 401 Unauthorized (not logged in or wrong permissions)
            let deletedElelements = await restockOrd.deleteRestockOrder(id);
            let deletedJoin1 = await restockOrd.deleteRestockOrderJoinSkuItems(id);
            let deletedJoins = await restockOrd.deleteRestockOrderJoinItems(id);
            // Check id validation
            if (deletedElelements === 0 || deletedJoins === 0 || deletedJoin1 === 0) res.status(422).json({ error: `Validation of id failed` }).end();
            // END OF VALIDATION
            res.status(204).end();
        } catch (err) {
            res.status(500).json({ error: `Service Unavailable` }).end();
        }
    });

}

module.exports = RestockOrderAPIs;
