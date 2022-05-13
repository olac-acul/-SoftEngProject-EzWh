function SKUItemAPIs(app) {
    const SKUItemDAO = require('./DAOs/SKUItemDAO');

    const skuItemDAO = new SKUItemDAO();

    // GET
    app.get('/api/skuitems', async (req, res) => {
        try {
            // 401 Unauthorized (not logged in or wrong permissions)
            const SKUItems = await skuItemDAO.getAllSKUItems();
            // END OF VALIDATION
            res.status(200).json(SKUItems);
        } catch (err) {
            res.status(500).json({ error: `Generic error` }).end();
        }
    });

    app.get('/api/skuitems/sku/:id', async (req, res) => {
        try {
            // 401 Unauthorized (not logged in or wrong permissions)
            const id = req.params.id;
            // 422 Unprocessable Entity
            if (!id) return res.status(422).json({ error: `Validation of ID failed` }).end();
            const SKUItems = await skuItemDAO.getAllAvailableSKUItems(id);
            // 404 Not Found
            if (!SKUItems) return res.status(404).json({ error: `No SKU associated to ID` }).end();
            // END OF VALIDATION
            res.status(200).json(SKUItems);
        } catch (err) {
            res.status(500).json({ error: `Generic error` }).end();
        }
    });

    app.get('/api/skuitems/:rfid', async (req, res) => {
        try {
            // 401 Unauthorized (not logged in or wrong permissions)
            const RFID = req.params.rfid;
            // 422 Unprocessable Entity
            if (!RFID) return res.status(422).json({ error: `Validation of RFID failed` }).end();
            const SKUItem = await skuItemDAO.getSKUItem(RFID);
            // 404 Not Found
            if (!RFID) return res.status(404).json({ error: `No SKU associated to RFID` }).end();
            // END OF VALIDATION
            res.status(200).json(SKUItem);
        } catch (err) {
            res.status(500).json({ error: `Generic error` }).end();
        }
    });


    // POST
    app.post('/api/skuitem', async (req, res) => {
        try {
            // 401 Unauthorized (not logged in or wrong permissions)
            // 422 Unprocessable Entity
            if (!req.body) return res.status(422).json({ error: `Validation of request body failed` }).end();
            const SKUItem = req.body;
            if (!(SKUItem.RFID && SKUItem.SKUId)) return res.status(422).json({ error: `Validation of request body failed` }).end();
            // 404 Not Found
            
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