function SKUItemAPIs(app) {
    const SKUItemDAO = require('./DAOs/SKUItemDAO');

    const skuItemDAO = new SKUItemDAO();



    // POST
    app.post('/api/skuitem', async (req, res) => {
        try {
            // 401 Unauthorized (not logged in or wrong permissions)
            // Check validation of request body
            if (!req.body) return res.status(422).json({ error: `Validation of request body failed` }).end();
            const SKUItem = req.body;
            // if (!(returnOrder && returnOrder.returnDate && returnOrder.products && returnOrder.restockOrderId))
            //     return res.status(422).json({ error: `Validation of request body failed` }).end();
            // Check number of elements of the request 
            // if (Object.entries(user).length !== 3) return res.status(422).json({ error: `Validation of request body failed` }).end();
            // 404 Not Found (no restock order associated to restockOrderId)
            // END OF VALIDATION
            await skuItemDAO.newSKUItemTable();
            await skuItemDAO.addSKUItem(SKUItem);
            return res.status(201).end();

        } catch (err) {
            res.status(503).json({ error: `Generic error` }).end();
        }
    });

}

module.exports = SKUItemAPIs;