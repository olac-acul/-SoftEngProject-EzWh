function TestDescriptorAPIs(app) {
    const TestDescriptorDAO = require('./DAOs/testDescriptorDAO');

    const testDescriptorDAO = new TestDescriptorDAO();


    //GET
    app.get('/api/testDescriptors', async (req, res) => {
        try {
            // 401 Unauthorized (not logged in or wrong permissions)
            const testDescriptors = await testDescriptorDAO.getTestDescriptors();
            res.status(200).json(testDescriptors);
        } catch (err) {
            res.status(500).json({ error: `Generic error` }).end();
        }
    });


    app.get('/api/testDescriptors/:id', async (req, res) => {
        let id = Number(req.params.id);
        try {
            // 401 Unauthorized (not logged in or wrong permissions)
            const testDescriptor = await testDescriptorDAO.getTestDescriptorById(id);
            // Check validation of id
            if (testDescriptor === 'Not Found') res.status(404).json({ error: `No test descriptor associated to id` }).end();
            // 422 Unprocessable Entity (validation of id failed)
            // END OF VALIDATION
            res.status(200).json(testDescriptor);
        } catch (err) {
            res.status(500).json({ error: `Generic error` }).end();
        }
    });


    //POST
    app.post('/api/testDescriptor', async (req, res) => {
        try {
            // 401 Unauthorized (not logged in or wrong permissions)
            // Check validation of request body
            if (!req.body.testDescriptor) return res.status(422).json({ error: `Validation of request body failed` }).end();
            let testDescriptor = req.body.testDescriptor;
            if (!(testDescriptor && testDescriptor.NAME && position.PROCEDUREDESCRIPTION && testDescriptor.IDSKU))
                return res.status(422).json({ error: `Validation of request body failed` }).end();
            // Check number of elements of the request 
            if (Object.entries(testDescriptor).length !== 3) return res.status(422).json({ error: `Validation of request body failed` }).end();
            // Check positionID type
            // END OF VALIDATION
            await testDescriptorDAO.newTable();
            await testDescriptorDAO.createTestDescriptor();
            return res.status(201).end();

        } catch (err) {
            res.status(503).json({ error: `Generic error` }).end();
        }
    });


    //DELETE
    app.delete('/api/testDescriptor/:id', async (req, res) => {
        let id = Number(req.params.id);
        try {
            // 401 Unauthorized (not logged in or wrong permissions)
            let deletedElelements = await testDescriptorDAO.deleteTestDescriptor(id);
            // Check id validation
            if (deletedElelements === 0) res.status(422).json({ error: `Validation of id failed` }).end();
            // END OF VALIDATION
            res.status(204).end();
        } catch (err) {
            res.status(503).json({ error: `Generic error` }).end();
        }
    });
}

module.exports = TestDescriptorAPIs;