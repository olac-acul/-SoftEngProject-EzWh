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
            if (!req.body) return res.status(422).json({ error: `Validation of request body failed` }).end();
            const user = {
                username: req.body.username,
                name: req.body.name,
                surname: req.body.surname,
                password: req.body.password,
                type: req.body.type
            };
            // 422 Unprocessable Entity
            if (!(user.username && user.name && user.surname && user.password && user.type) ||
                user.password.length < 8 ||
                !user.username.includes('@') ||
                user.type === 'manager') return res.status(422).json({ error: `Validation of request body failed or attempt to create manager or administrator accounts` }).end();
            // 409 Conflict
            const users = await userDAO.getUsersExceptManager();
            for (let i of users) {
                if (i.email === user.username && i.type === user.type) return res.status(409).json({ error: `User with same mail and type already exists` }).end();
            }

            // END OF VALIDATION
            await userDAO.newUserTable();
            await userDAO.addUser(user);
            return res.status(201).end();

        } catch (err) {
            res.status(503).json({ error: `Generic error` }).end();
        }
    });

    app.post('/api/managerSessions', async (req, res) => {
        try {
            // 401 Unauthorized (not logged in or wrong permissions)
            const username = req.body.username;
            const password = req.body.password;
            const user = await userDAO.loginUser(username, password, 'manager');
            if (user === 'Not found') return res.status(401).json({ error: `Wrong username and/or password` }).end();
            // END OF VALIDATION
            return res.status(200).json(user);
        } catch (err) {
            res.status(500).json({ error: `Generic error` }).end();
        }
    });

    app.post('/api/customerSessions', async (req, res) => {
        try {
            // 401 Unauthorized (not logged in or wrong permissions)
            const username = req.body.username;
            const password = req.body.password;
            const user = await userDAO.loginUser(username, password, 'customer');
            if (user === 'Not found') return res.status(401).json({ error: `Wrong username and/or password` }).end();
            // END OF VALIDATION
            return res.status(200).json(user);
        } catch (err) {
            res.status(500).json({ error: `Generic error` }).end();
        }
    });

    app.post('/api/supplierSessions', async (req, res) => {
        try {
            // 401 Unauthorized (not logged in or wrong permissions)
            const username = req.body.username;
            const password = req.body.password;
            const user = await userDAO.loginUser(username, password, 'supplier');
            if (user === 'Not found') return res.status(401).json({ error: `Wrong username and/or password` }).end();
            // END OF VALIDATION
            return res.status(200).json(user);
        } catch (err) {
            res.status(500).json({ error: `Generic error` }).end();
        }
    });

    app.post('/api/clerkSessions', async (req, res) => {
        try {
            // 401 Unauthorized (not logged in or wrong permissions)
            const username = req.body.username;
            const password = req.body.password;
            const user = await userDAO.loginUser(username, password, 'clerk');
            if (user === 'Not found') return res.status(401).json({ error: `Wrong username and/or password` }).end();
            // END OF VALIDATION
            return res.status(200).json(user);
        } catch (err) {
            res.status(500).json({ error: `Generic error` }).end();
        }
    });

    app.post('/api/qualityEmployeeSessions', async (req, res) => {
        try {
            // 401 Unauthorized (not logged in or wrong permissions)
            const username = req.body.username;
            const password = req.body.password;
            const user = await userDAO.loginUser(username, password, 'qualityEmployee');
            if (user === 'Not found') return res.status(401).json({ error: `Wrong username and/or password` }).end();
            // END OF VALIDATION
            return res.status(200).json(user);
        } catch (err) {
            res.status(500).json({ error: `Generic error` }).end();
        }
    });

    app.post('/api/deliveryEmployeeSessions', async (req, res) => {
        try {
            // 401 Unauthorized (not logged in or wrong permissions)
            const username = req.body.username;
            const password = req.body.password;
            const user = await userDAO.loginUser(username, password, 'deliveryEmployee');
            if (user === 'Not found') return res.status(401).json({ error: `Wrong username and/or password` }).end();
            // END OF VALIDATION
            return res.status(200).json(user);
        } catch (err) {
            res.status(500).json({ error: `Generic error` }).end();
        }
    });


    // PUT
    app.put('/api/users/:username', async (req, res) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        try {
            const username = req.params.username;
            const oldType = req.body.oldType;
            const newType = req.body.newType;
            // 422 Unprocessable Entity
            if (!(username && oldType && newType) || oldType === 'manager' || newType === 'manager')
                return res.status(422).json({ error: `Validation of request body or of username failed or attempt to modify rights to administrator or manager` }).end();
            updatedElements = await userDAO.modifyUserRights(username, oldType, newType);
            // 404 Not found
            if (updatedElements === 0) return res.status(404).json({ error: `Wrong username or oldType fields or user doesn't exist` }).end();
            return res.status(200).end();
        } catch (err) {
            res.status(503).json({ error: `Generic error` }).end();
        }
    });


    //DELETE
    app.delete('/api/users/:username/:type', async (req, res) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        try {
            const username = req.params.username;
            const type = req.params.type;
            // 422 Unprocessable Entity
            if (!(username && type) || type === 'manager')
                return res.status(422).json({ error: `Validation of username or of type failed or attempt to delete a manager/administrator` }).end();
            const deletedUsers = await userDAO.deleteUser(username, type);
            if (deletedUsers === 0) res.status(422).json({ error: `Validation of username or of type failed or attempt to delete a manager/administrator` }).end();
            // END OF VALIDATION
            res.status(204).end();
        } catch (err) {
            res.status(503).json({ error: `Generic error` }).end();
        }
    });

}

module.exports = UserAPIs;