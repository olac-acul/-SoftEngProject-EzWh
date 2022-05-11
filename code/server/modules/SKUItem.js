function SKUItemAPIs(app) {
    const SKUItemDAO = require('./DAOs/SKUItemDAO');

    const skuItemDAO = new SKUItemDAO();

    // GET
    app.get('/api/skuitems', async (req, res) => {
        try {
            // 401 Unauthorized (not logged in or wrong permissions)
            const SKUItems = await skuItemDAO.getAllSKUItems();
            res.status(200).json(SKUItems);
        } catch (err) {
            res.status(500).json({ error: `Generic error` }).end();
        }
    });

    app.get('/api/skuitems/sku/:id', async (req, res) => {
        try {
            const id = req.params.id;
            // 401 Unauthorized (not logged in or wrong permissions)
            const SKUItems = await skuItemDAO.getAllAvailableSKUItems(id);
            res.status(200).json(SKUItems);
        } catch (err) {
            res.status(500).json({ error: `Generic error` }).end();
        }
    });

    app.get('/api/skuitems/:rfid', async (req, res) => {
        try {
            const RFID = req.params.rfid;
            // 401 Unauthorized (not logged in or wrong permissions)
            const SKUItem = await skuItemDAO.getSKUItem(RFID);
            res.status(200).json(SKUItem);
        } catch (err) {
            res.status(500).json({ error: `Generic error` }).end();
        }
    });


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


    // PUT
    app.put('/api/skuitems/:rfid', async (req, res) => {
        try {
            const oldRFID = req.params.rfid;
            const newRFID = req.body.newRFID;
            const newAvailable = req.body.newAvailable;
            const newDateOfStock = req.body.newDateOfStock;
            updatedElements = await skuItemDAO.modifySKUItem(oldRFID, newRFID, newAvailable, newDateOfStock);
            if (updatedElements === 0) return res.status(404).json({ error: `No SKU Item associated to RFID` }).end();
            return res.status(200).end();
        } catch (err) {
            res.status(503).json({ error: `Generic error` }).end();
        }
    });


    //DELETE
    app.delete('/api/skuitems/:rfid', async (req, res) => {
        try {
            const RFID = req.params.rfid;
            // 401 Unauthorized (not logged in or wrong permissions)
            const deletedSKUItems = await skuItemDAO.deleteSKUItem(RFID);
            // Check id validation
            if (deletedSKUItems === 0) res.status(422).json({ error: `Validation of RFID failed` }).end();
            // END OF VALIDATION
            res.status(204).end();
        } catch (err) {
            res.status(503).json({ error: `Generic error` }).end();
        }
    });

}

module.exports = SKUItemAPIs;