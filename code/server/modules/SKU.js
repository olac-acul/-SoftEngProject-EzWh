function SKUAPIs(app){
    const SKUDAO = require('./DAOs/SKUDAO');

    const skuDAO = new SKUDAO();

    // GET
    app.get('/api/skus', async (req, res) => {
        try {
            // 401 Unauthorized (not logged in or wrong permissions)
            const SKUs = await skuDAO.getAllSKUs();
            res.status(200).json(SKUs);
        } catch (err) {
            res.status(500).json({ error: `Generic error` }).end();
        }
    });

    app.get('/api/skus/:id', async (req, res) => {
        try {
            const ID = req.params.id;
            // 401 Unauthorized (not logged in or wrong permissions)
            // 422 Check id validation
            const SKU = await skuDAO.getSKU(ID);
            // 404 No SKU associated to id
            res.status(200).json(SKU);
        } catch (err) {
            res.status(500).json({ error: `Generic error` }).end();
        }
    });

    // POST
    app.post('/api/sku', async (req, res) => {
        try {
            // 401 Unauthorized (not logged in or wrong permissions)
            // Check validation of request body
            if (!req.body) return res.status(422).json({ error: `Validation of request body failed` }).end();
            const SKU = req.body;
            // END OF VALIDATION
            // await skuDAO.newSKUTable();
            await skuDAO.addSKU(SKU);
            return res.status(201).end();

        } catch (err) {
            res.status(503).json({ error: `Generic error` }).end();
        }
    });

    //DELETE
    app.delete('/api/skus/:id', async (req, res) => {
        try {
            const ID = req.params.id;
            // 401 Unauthorized (not logged in or wrong permissions)
            const deletedSKUs = await skuDAO.deleteSKU(ID);
            // Check id validation
            if (deletedSKUs === 0) res.status(422).json({ error: `Validation of ID failed` }).end();
            // END OF VALIDATION
            res.status(204).end();
        } catch (err) {
            res.status(503).json({ error: `Generic error` }).end();
        }
    });

}

module.exports = SKUAPIs;