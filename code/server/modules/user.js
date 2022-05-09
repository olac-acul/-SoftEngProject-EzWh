function UserAPIs(app) {
    const UserDAO = require('./DAOs/userDAO');

    const userDAO = new UserDAO();

    //GET



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
            await userDAO.addUser(user);
            return res.status(201).end();

        } catch (err) {
            res.status(503).json({ error: `Generic error` }).end();
        }
    });
}

module.exports = UserAPIs;