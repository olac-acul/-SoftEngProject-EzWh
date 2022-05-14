function UserAPIs(app) {
    const UserDAO = require('./DAOs/userDAO');
    const validator = require('validator')
    const userDAO = new UserDAO();

    const availableUsersList = ["customer", "qualityEmployee", "clerk", "deliveryEmployee", "supplier"];

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
            if (Object.keys(req.body).length !== 5)
                res.status(422).json({ error: `Validation of request body failed or attempt to create manager or administrator accounts` }).end();
            if (!availableUsersList.includes(req.body.type))
                res.status(422).json({ error: `Validation of request body failed or attempt to create manager or administrator accounts` }).end();
            if (!validator.isEmail(req.body.username))
                res.status(422).json({ error: `Username must be an email` }).end();
            if (req.body.password.length < 8)
                res.status(422).json({ error: `Password must have at least 8 characters` }).end();
            const user = {
                username: req.body.username,
                name: req.body.name,
                surname: req.body.surname,
                password: req.body.password,
                type: req.body.type
            };
            const users = await userDAO.getUsersExceptManager();
            for (let i of users) {
                if (i.email === user.username && i.type === user.type)
                    return res.status(409).json({ error: `User with same mail and type already exists` }).end();
            }
            // // END OF VALIDATION
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
            if (!validator.isEmail(req.body.username))
                res.status(422).json({ error: `Username must be an email` }).end();
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
            if (!validator.isEmail(req.body.username))
                res.status(422).json({ error: `Username must be an email` }).end();
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
            if (!validator.isEmail(req.body.username))
                res.status(422).json({ error: `Username must be an email` }).end();
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
            if (!validator.isEmail(req.body.username))
                res.status(422).json({ error: `Username must be an email` }).end();
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
            if (!validator.isEmail(req.body.username))
                res.status(422).json({ error: `Username must be an email` }).end();
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
            if (!validator.isEmail(req.body.username))
                res.status(422).json({ error: `Username must be an email` }).end();
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
            if (!validator.isEmail(req.params.username))
                res.status(422).json({ error: `Validation of request body or of username failed or attempt to modify rights to administrator or manager` }).end();
            if (Object.keys(req.body).length !== 2)
                res.status(422).json({ error: `Validation of request body or of username failed or attempt to modify rights to administrator or manager` }).end();
            if (!availableUsersList.includes(req.body.oldType))
                res.status(422).json({ error: `Validation of request body failed or attempt to create manager or administrator accounts` }).end();
            if (!availableUsersList.includes(req.body.newType))
                res.status(422).json({ error: `Validation of request body failed or attempt to create manager or administrator accounts` }).end();
            const username = req.params.username;
            const oldType = req.body.oldType;
            const newType = req.body.newType;
            updatedElements = await userDAO.modifyUserRights(username, oldType, newType);
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
            if (!validator.isEmail(req.params.username))
                res.status(422).json({ error: `Validation of username or of type failed or attempt to delete a manager/administrator` }).end();
            if (!availableUsersList.includes(req.params.type))
                res.status(422).json({ error: `Validation of username or of type failed or attempt to delete a manager/administrator` }).end();
            const username = req.params.username;
            const type = req.params.type;
            // const deletedUsers = await userDAO.deleteUser(username, type);
            // if (deletedUsers === 0) res.status(422).json({ error: `Validation of username or of type failed or attempt to delete a manager/administrator` }).end();
            // END OF VALIDATION
            res.status(204).end();
        } catch (err) {
            res.status(503).json({ error: `Generic error` }).end();
        }
    });

}

module.exports = UserAPIs;