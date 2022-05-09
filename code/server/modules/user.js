function UserAPIs(app) {
    const UserDAO = require('./DAOs/userDAO');

    const userDAO = new UserDAO();

    //GET
    // app.get('/api/userinfo', async (req, res) => {
    //     try {
    //         // 401 Unauthorized (not logged in or wrong permissions)
    //         const returnOrders = [];
    //         const orders = await returnOrderDAO.getReturnOrders();
    //         for (let i of orders) {
    //             let returnOrder = await returnOrderDAO.getReturnOrderById(i.id);
    //             returnOrders.push(returnOrder);
    //         }
    //         res.status(200).json(returnOrders);
    //     } catch (err) {
    //         res.status(500).json({ error: `Generic error` }).end();
    //     }
    // });

    app.get('/api/suppliers', async (req, res) => {
        try {
            // 401 Unauthorized (not logged in or wrong permissions)
            const suppliers = await userDAO.getSuppliers();
            res.status(200).json(suppliers);
        } catch (err) {
            res.status(500).json({ error: `Generic error` }).end();
        }
    });

    app.get('/api/users', async (req, res) => {
        try {
            // 401 Unauthorized (not logged in or wrong permissions)
            const users = await userDAO.getUsersExceptManager();
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json({ error: `Generic error` }).end();
        }
    });


    //POST
    app.post('/api/newUser', async (req, res) => {
        try {
            // 401 Unauthorized (not logged in or wrong permissions)
            // Check validation of request body
            if (!req.body.user) return res.status(422).json({ error: `Validation of request body failed` }).end();
            let user = req.body.user;
            // if (!(returnOrder && returnOrder.returnDate && returnOrder.products && returnOrder.restockOrderId))
            //     return res.status(422).json({ error: `Validation of request body failed` }).end();
            // Check number of elements of the request 
            // if (Object.entries(user).length !== 3) return res.status(422).json({ error: `Validation of request body failed` }).end();
            // 404 Not Found (no restock order associated to restockOrderId)
            // END OF VALIDATION
            await userDAO.newUserTable();
            let userId = await userDAO.addUser(user);
            if (user.type === 'supplier') {
                const supplier = {
                    id: userId,
                    email: user.email
                }
                await userDAO.newSupplierTable();
                await userDAO.addSupplier(supplier);
            }
            return res.status(201).end();

        } catch (err) {
            res.status(503).json({ error: `Generic error` }).end();
        }
    });

    app.post('/api/managerSessions', async (req, res) => {
        try {
            let username = req.body.username;
            let password = req.body.password;
            let user = await userDAO.loginUser(username, password, 'manager');
            if (user === 'Not found') return res.status(401).json({ error: `Wrong username and/or password` }).end();
            // END OF VALIDATION
            return res.status(200).json(user);
        } catch (err) {
            res.status(500).json({ error: `Generic error` }).end();
        }
    });

    app.post('/api/customerSessions', async (req, res) => {
        try {
            let username = req.body.username;
            let password = req.body.password;
            let user = await userDAO.loginUser(username, password, 'customer');
            if (user === 'Not found') return res.status(401).json({ error: `Wrong username and/or password` }).end();
            // END OF VALIDATION
            return res.status(200).json(user);
        } catch (err) {
            res.status(500).json({ error: `Generic error` }).end();
        }
    });

    app.post('/api/supplierSessions', async (req, res) => {
        try {
            let username = req.body.username;
            let password = req.body.password;
            let user = await userDAO.loginUser(username, password, 'supplier');
            if (user === 'Not found') return res.status(401).json({ error: `Wrong username and/or password` }).end();
            // END OF VALIDATION
            return res.status(200).json(user);
        } catch (err) {
            res.status(500).json({ error: `Generic error` }).end();
        }
    });

    app.post('/api/clerkSessions', async (req, res) => {
        try {
            let username = req.body.username;
            let password = req.body.password;
            let user = await userDAO.loginUser(username, password, 'clerk');
            if (user === 'Not found') return res.status(401).json({ error: `Wrong username and/or password` }).end();
            // END OF VALIDATION
            return res.status(200).json(user);
        } catch (err) {
            res.status(500).json({ error: `Generic error` }).end();
        }
    });

    app.post('/api/qualityEmployeeSessions', async (req, res) => {
        try {
            let username = req.body.username;
            let password = req.body.password;
            let user = await userDAO.loginUser(username, password, 'qualityEmployee');
            if (user === 'Not found') return res.status(401).json({ error: `Wrong username and/or password` }).end();
            // END OF VALIDATION
            return res.status(200).json(user);
        } catch (err) {
            res.status(500).json({ error: `Generic error` }).end();
        }
    });

    app.post('/api/deliveryEmployeeSessions', async (req, res) => {
        try {
            let username = req.body.username;
            let password = req.body.password;
            let user = await userDAO.loginUser(username, password, 'deliveryEmployee');
            if (user === 'Not found') return res.status(401).json({ error: `Wrong username and/or password` }).end();
            // END OF VALIDATION
            return res.status(200).json(user);
        } catch (err) {
            res.status(500).json({ error: `Generic error` }).end();
        }
    });




}

module.exports = UserAPIs;