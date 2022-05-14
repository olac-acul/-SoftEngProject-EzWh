const express = require('express');

const PositionService = require('../services/positionService');
const db = require('../DAOs/positionDAO');

const positionService = new PositionService(db);

const router = express.Router();


//GET
router.get('/positions', async (req, res) => {
    try {
        // 401 Unauthorized (not logged in or wrong permissions)
        const positions = await positionService.getPositions();
        res.status(200).json(positions);
    } catch (err) {
        res.status(500).json({ error: `Generic error` }).end();
    }
});


//POST
router.post('/position', async (req, res) => {
    try {
        // 401 Unauthorized (not logged in or wrong permissions)
        // Check validation of request body
        if (!req.body.position) return res.status(422).json({ error: `Validation of request body failed` }).end();
        let position = req.body.position;
        if (!(position && position.positionID && position.aisleID && position.row && position.col && position.maxWeight && position.maxVolume))
            return res.status(422).json({ error: `Validation of request body failed` }).end();
        // Check number of elements of the request 
        if (Object.entries(position).length !== 6) return res.status(422).json({ error: `Validation of request body failed` }).end();
        // Check positionID type
        // END OF VALIDATION
        // await positionService.newTable();
        await positionService.createPosition(position);
        return res.status(201).end();

    } catch (err) {
        res.status(503).json({ error: `Generic error` }).end();
    }
});


//DELETE
router.delete('/position/:id', async (req, res) => {
    let id = String(req.params.id);
    try {
        // 401 Unauthorized (not logged in or wrong permissions)
        let deletedElelements = await positionService.deletePosition(id);
        // Check id validation
        if (deletedElelements === 0) res.status(422).json({ error: `Validation of id failed` }).end();
        // END OF VALIDATION
        res.status(204).end();
    } catch (err) {
        res.status(503).json({ error: `Generic error` }).end();
    }
});

module.exports = router;