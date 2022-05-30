const express = require('express');

const UserService = require('../services/userService');
const db = require('../DAOs/userDAO');

const userService = new UserService(db);

const router = express.Router();


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
        const status = await userService.addUser(req.body);
        if (status === '422')
            res.status(422).json({ error: `Validation of request body failed or attempt to create manager or administrator accounts` }).end();
        else if (status === '409')
            return res.status(409).json({ error: `User with same mail and type already exists` }).end();
        else if (status === '201')
            return res.status(201).end();

    } catch (err) {
        res.status(503).json({ error: `Generic error` }).end();
    }
});

router.post('/managerSessions', async (req, res) => {
    try {
        const user = await userService.loginUser(req.body.username, req.body.password, 'manager');
        if (user === '422')
            res.status(422).json({ error: `Username must be an email` }).end();
        else if (user === '404')
            return res.status(404).json({ error: `Wrong username and/or password` }).end();
        else
            return res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: `Generic error` }).end();
    }
});

router.post('/customerSessions', async (req, res) => {
    try {
        const user = await userService.loginUser(req.body.username, req.body.password, 'customer');
        if (user === '422')
            res.status(422).json({ error: `Username must be an email` }).end();
        else if (user === '404')
            return res.status(404).json({ error: `Wrong username and/or password` }).end();
        else
            return res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: `Generic error` }).end();
    }
});

router.post('/supplierSessions', async (req, res) => {
    try {
        const user = await userService.loginUser(req.body.username, req.body.password, 'supplier');
        if (user === '422')
            res.status(422).json({ error: `Username must be an email` }).end();
        else if (user === '404')
            return res.status(404).json({ error: `Wrong username and/or password` }).end();
        else
            return res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: `Generic error` }).end();
    }
});

router.post('/clerkSessions', async (req, res) => {
    try {
        const user = await userService.loginUser(req.body.username, req.body.password, 'clerk');
        if (user === '422')
            res.status(422).json({ error: `Username must be an email` }).end();
        else if (user === '404')
            return res.status(404).json({ error: `Wrong username and/or password` }).end();
        else
            return res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: `Generic error` }).end();
    }
});

router.post('/qualityEmployeeSessions', async (req, res) => {
    try {
        const user = await userService.loginUser(req.body.username, req.body.password, 'qualityEmployee');
        if (user === '422')
            res.status(422).json({ error: `Username must be an email` }).end();
        else if (user === '404')
            return res.status(404).json({ error: `Wrong username and/or password` }).end();
        else
            return res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: `Generic error` }).end();
    }
});

router.post('/deliveryEmployeeSessions', async (req, res) => {
    try {
        const user = await userService.loginUser(req.body.username, req.body.password, 'deliveryEmployee');
        if (user === '422')
            res.status(422).json({ error: `Username must be an email` }).end();
        else if (user === '404')
            return res.status(404).json({ error: `Wrong username and/or password` }).end();
        else
            return res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: `Generic error` }).end();
    }
});


// PUT
router.put('/users/:username', async (req, res) => {
    try {
        const status = await userService.modifyUserRights(req.params.username, req.body);
        if (status === '422')
            res.status(422).json({ error: `Validation of request body or of username failed or attempt to modify rights to administrator or manager` }).end();
        else if (status === '404')
            return res.status(404).json({ error: `Wrong username or oldType fields or user doesn't exist` }).end();
        else if (status === '200')
            return res.status(200).end();
    } catch (err) {
        res.status(503).json({ error: `Generic error` }).end();
    }
});


//DELETE
router.delete('/users/:username/:type', async (req, res) => {
    try {
        const status = await userService.deleteUser(req.params.username, req.params.type);
        if (status === '422')
            res.status(422).json({ error: `Validation of username or of type failed or attempt to delete a manager/administrator` }).end();
        else if (status === '204')
            res.status(204).end();
    } catch (err) {
        res.status(503).json({ error: `Generic error` }).end();
    }
});

router.delete('/usersAll', async (req, res) => {
    try {
        await userService.deleteUsers();
        res.status(204).end();
    } catch (err) {
        res.status(503).json({ error: `Generic error` }).end();
    }
});

module.exports = router;