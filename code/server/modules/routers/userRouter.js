const express = require('express');

const UserService = require('../services/userService');
const db = require('../DAOs/userDAO');

const userService = new UserService(db);

const router = express.Router();

const validator = require('validator');

const availableUsersList = ["customer", "qualityEmployee", "clerk", "deliveryEmployee", "supplier"];


//GET
// router.get('/userinfo', async (req, res) => {
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

router.get('/suppliers', async (req, res) => {
    try {
        const suppliers = await userService.getSuppliers();
        res.status(200).json(suppliers);
    } catch (err) {
        res.status(500).json({ error: `Generic error` }).end();
    }
});

router.get('/users', async (req, res) => {
    try {
        const users = await userService.getUsersExceptManager();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: `Generic error` }).end();
    }
});


//POST
router.post('/newUser', async (req, res) => {
    try {
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
        const users = await userService.getUsersExceptManager();
        for (let i of users) {
            if (i.email === user.username && i.type === user.type)
                return res.status(409).json({ error: `User with same mail and type already exists` }).end();
        }
        // // END OF VALIDATION
        await userService.addUser(user);
        return res.status(201).end();

    } catch (err) {
        res.status(503).json({ error: `Generic error` }).end();
    }
});

router.post('/managerSessions', async (req, res) => {
    try {
        if (!validator.isEmail(req.body.username))
            res.status(422).json({ error: `Username must be an email` }).end();
        const username = req.body.username;
        const password = req.body.password;
        const user = await userService.loginUser(username, password, 'manager');
        if (user === 'Not found') return res.status(401).json({ error: `Wrong username and/or password` }).end();
        // END OF VALIDATION
        return res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: `Generic error` }).end();
    }
});

router.post('/customerSessions', async (req, res) => {
    try {
        if (!validator.isEmail(req.body.username))
            res.status(422).json({ error: `Username must be an email` }).end();
        const username = req.body.username;
        const password = req.body.password;
        const user = await userService.loginUser(username, password, 'customer');
        if (user === 'Not found') return res.status(401).json({ error: `Wrong username and/or password` }).end();
        // END OF VALIDATION
        return res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: `Generic error` }).end();
    }
});

router.post('/supplierSessions', async (req, res) => {
    try {
        if (!validator.isEmail(req.body.username))
            res.status(422).json({ error: `Username must be an email` }).end();
        const username = req.body.username;
        const password = req.body.password;
        const user = await userService.loginUser(username, password, 'supplier');
        if (user === 'Not found') return res.status(401).json({ error: `Wrong username and/or password` }).end();
        // END OF VALIDATION
        return res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: `Generic error` }).end();
    }
});

router.post('/clerkSessions', async (req, res) => {
    try {
        if (!validator.isEmail(req.body.username))
            res.status(422).json({ error: `Username must be an email` }).end();
        const username = req.body.username;
        const password = req.body.password;
        const user = await userService.loginUser(username, password, 'clerk');
        if (user === 'Not found') return res.status(401).json({ error: `Wrong username and/or password` }).end();
        // END OF VALIDATION
        return res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: `Generic error` }).end();
    }
});

router.post('/qualityEmployeeSessions', async (req, res) => {
    try {
        if (!validator.isEmail(req.body.username))
            res.status(422).json({ error: `Username must be an email` }).end();
        const username = req.body.username;
        const password = req.body.password;
        const user = await userService.loginUser(username, password, 'qualityEmployee');
        if (user === 'Not found') return res.status(401).json({ error: `Wrong username and/or password` }).end();
        // END OF VALIDATION
        return res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: `Generic error` }).end();
    }
});

router.post('/deliveryEmployeeSessions', async (req, res) => {
    try {
        if (!validator.isEmail(req.body.username))
            res.status(422).json({ error: `Username must be an email` }).end();
        const username = req.body.username;
        const password = req.body.password;
        const user = await userService.loginUser(username, password, 'deliveryEmployee');
        if (user === 'Not found') return res.status(401).json({ error: `Wrong username and/or password` }).end();
        // END OF VALIDATION
        return res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: `Generic error` }).end();
    }
});


// PUT
router.put('/users/:username', async (req, res) => {
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
        updatedElements = await userService.modifyUserRights(username, oldType, newType);
        if (updatedElements === 0) return res.status(404).json({ error: `Wrong username or oldType fields or user doesn't exist` }).end();
        return res.status(200).end();
    } catch (err) {
        res.status(503).json({ error: `Generic error` }).end();
    }
});


//DELETE
router.delete('/users/:username/:type', async (req, res) => {
    try {
        if (!validator.isEmail(req.params.username))
            res.status(422).json({ error: `Validation of username or of type failed or attempt to delete a manager/administrator` }).end();
        if (!availableUsersList.includes(req.params.type))
            res.status(422).json({ error: `Validation of username or of type failed or attempt to delete a manager/administrator` }).end();
        const username = req.params.username;
        const type = req.params.type;
        const deletedUsers = await userService.deleteUser(username, type);
        if (deletedUsers === 0) res.status(422).json({ error: `Validation of username or of type failed or attempt to delete a manager/administrator` }).end();
        // END OF VALIDATION
        res.status(204).end();
    } catch (err) {
        res.status(503).json({ error: `Generic error` }).end();
    }
});

module.exports = router;