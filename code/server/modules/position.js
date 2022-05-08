function PositionAPIs(app) {
    const PositionDAO = require('./DAOs/positionDAO');

    const positionDAO = new PositionDAO();


    //GET
    app.get('/api/positions', async (req, res) => {
        try {
            // 401 Unauthorized (not logged in or wrong permissions)
            const positions = await positionDAO.getPositions();
            res.status(200).json(positions);
        } catch (err) {
            res.status(500).json({ error: `Generic error` }).end();
        }
    });
    

    //POST
    app.post('/api/position', async (req, res) => {
        try {
            // 401 Unauthorized (not logged in or wrong permissions)
            // Check validation of request body
            if (!req.body.position) return res.status(422).json({ error: `Validation of request body failed` }).end();
            let position = req.body.position;
            if (!(position && position.POSITIONID && position.AISLEID && position.ROW && position.COL && position.MAXWEIGHT && position.MAXVOLUME))
                return res.status(422).json({ error: `Validation of request body failed` }).end();
            // Check number of elements of the request 
            if (Object.entries(position).length !== 6) return res.status(422).json({ error: `Validation of request body failed` }).end();
            // Check positionID type
            // END OF VALIDATION
            await positionDAO.newTable();
            await positionDAO.createPosition();
            return res.status(201).end();

        } catch (err) {
            res.status(503).json({ error: `Generic error` }).end();
        }
    });


    //DELETE
    app.delete('/api/position/:id', async (req, res) => {
        let id = String(req.params.id);
        try {
            // 401 Unauthorized (not logged in or wrong permissions)
            let deletedElelements = await positionDAO.deletePosition(id);
            // Check id validation
            if (deletedElelements === 0) res.status(422).json({ error: `Validation of id failed` }).end();
            // END OF VALIDATION
            res.status(204).end();
        } catch (err) {
            res.status(503).json({ error: `Generic error` }).end();
        }
    });
}
module.exports = PositionAPIs;