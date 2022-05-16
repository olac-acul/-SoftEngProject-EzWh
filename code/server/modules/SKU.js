function SKUAPIs(app){
    const SKUDAO = require('./DAOs/SKUDAO');
    // const PositionDAO = require('./DAOs/positionDAO');

    const skuDAO = new SKUDAO();
    // const positionDAO = new PositionDAO();

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

    // PUT
    // app.put('/api/sku/:id', async (req, res) => {
    //     try {
    //         const id = req.params.id;
    //         const sku = skuDAO.getSKU(id);
    //         const pos = sku.position;
    //         const newDescription = req.body.newDescription;
    //         const newWeight = req.body.newWeight;
    //         const newVolume = req.body.newVolume;
    //         const newPrice = req.body.newPrice;
    //         const newAvailableQuantity = req.body.newAvailableQuantity;
    //         const newOccupiedWeight = newAvailableQuantity * newWeight;
    //         const newOccupiedVolume = newAvailableQuantity * newVolume;
    //         if (pos) updatedPosition = await positionDAO.updatePosition(pos, newOccupiedWeight, newOccupiedVolume);
    //         updatedElements = await skuDAO.modifySKU(id, newDescription, newWeight, newVolume, newPrice, newAvailableQuantity);
    //         if (updatedElements === 0) return res.status(404).json({ error: `No SKU associated to ID` }).end();
    //         return res.status(200).end();
    //     } catch (err) {
    //         res.status(503).json({ error: `Generic error` }).end();
    //     }
    // });

    // app.put('/api/sku/:id/position', async (req, res) => {
    //     try {
    //         const id = req.params.id;
    //         const sku = skuDAO.getSKU(id);
    //         const newPos = req.body.position;
    //         const newAvailableQuantity = sku.availableQuantity;
    //         const newOccupiedWeight = newAvailableQuantity * newWeight;
    //         const newOccupiedVolume = newAvailableQuantity * newVolume;
    //         updatedElements = await skuDAO.modifySKUposition(id, newPos);
    //         updatedPosition = await positionDAO.updatePosition(newPos, newOccupiedWeight, newOccupiedVolume);
    //         if (updatedElements === 0) return res.status(404).json({ error: `No SKU associated to ID` }).end();
    //         return res.status(200).end();
    //     } catch (err) {
    //         res.status(503).json({ error: `Generic error` }).end();
    //     }
    // });

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