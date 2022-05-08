function ItemAPIs(app) {
    const ItemDAO = require('./DAOs/itemDAO');

    const itemDAO = new ItemDAO();


    //GET
    app.get('/api/items', async (req, res) => {
        try {
            // 401 Unauthorized (not logged in or wrong permissions)
            const items = await itemDAO.getItems();
            res.status(200).json(items);
        } catch (err) {
            res.status(500).json({ error: `Generic error` }).end();
        }
    });


    app.get('/api/items/:id', async (req, res) => {
        let id = Number(req.params.id);
        try {
            // 401 Unauthorized (not logged in or wrong permissions)
            const item = await itemDAO.getItemById(id);
            // Check validation of id
            if (item === 'Not Found') res.status(404).json({ error: `No item associated to id` }).end();
            // 422 Unprocessable Entity (validation of id failed)
            // END OF VALIDATION
            res.status(200).json(item);
        } catch (err) {
            res.status(500).json({ error: `Generic error` }).end();
        }
    });


    //POST
    app.post('/api/item', async (req, res) => {
        try {
            // 401 Unauthorized (not logged in or wrong permissions)
            // Check validation of request body
            if (!req.body.item) return res.status(422).json({ error: `Validation of request body failed` }).end();
            let item = req.body.item;
            if (!(item && item.ID && item.DESCRIPTION && item.PRICE && item.SKUID && item.SUPPLIERID))
                return res.status(422).json({ error: `Validation of request body failed` }).end();
            // Check number of elements of the request 
            if (Object.entries(item).length !== 5) return res.status(422).json({ error: `Validation of request body failed` }).end();
            // Check positionID type
            // END OF VALIDATION
            await itemDAO.newTable();
            await itemDAO.createItem();
            return res.status(201).end();

        } catch (err) {
            res.status(503).json({ error: `Generic error` }).end();
        }
    });


    //DELETE
    app.delete('/api/item/:id', async (req, res) => {
        let id = Number(req.params.id);
        try {
            // 401 Unauthorized (not logged in or wrong permissions)
            let deletedElelements = await itemDAO.deleteItem(id);
            // Check id validation
            if (deletedElelements === 0) res.status(422).json({ error: `Validation of id failed` }).end();
            // END OF VALIDATION
            res.status(204).end();
        } catch (err) {
            res.status(503).json({ error: `Generic error` }).end();
        }
    });
}

module.exports = ItemAPIs;