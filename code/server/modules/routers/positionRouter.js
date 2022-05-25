const express = require('express');

const PositionService = require('../services/positionService');
const db = require('../DAOs/positionDAO');

const positionService = new PositionService(db);

const router = express.Router();


//GET
router.get('/positions', async (req, res) => {
    try {
        const positions = await positionService.getPositions();
        res.status(200).json(positions);
    } catch (err) {
        res.status(500).json({ error: `Generic error` }).end();
    }
});


//POST
router.post('/position', async (req, res) => {
    try {
        const position = req.body;
        const status = await positionService.createPosition(position);
        if (status === '422')
            return res.status(422).json({ error: `Validation of request body failed` }).end();
        else if (status === '201')
            return res.status(201).end();

    } catch (err) {
        res.status(503).json({ error: `Generic error` }).end();
    }
});


// PUT
router.put('/position/:positionID', async (req, res) => {
    try {
        const status = await positionService.modifyPosition(req.params.positionID, req.body);
        if (status === '422')
            return res.status(422).json({ error: `Validation of request body or of positionID failed` }).end();
        if (status === '404')
            return res.status(404).json({ error: `No position associated to positionID` }).end();
        else if (status === '200')
            return res.status(200).end();
    } catch (err) {
        res.status(503).json({ error: `Generic error` }).end();
    }
});

router.put('/position/:positionID/changeID', async (req, res) => {
    try {
        const status = await positionService.changePositionId(req.params.positionID, req.body);
        if (status === '422')
            return res.status(422).json({ error: `Validation of request body or of positionID failed` }).end();
        if (status === '404')
            return res.status(404).json({ error: `No position associated to positionID` }).end();
        else if (status === '200')
            return res.status(200).end();
    } catch (err) {
        res.status(503).json({ error: `Generic error` }).end();
    }
});


//DELETE
router.delete('/position/:id', async (req, res) => {
    try {
        const status = await positionService.deletePosition(req.params.id);
        if (status === '422')
            return res.status(422).json({ error: `Validation of positionID failed` }).end();
        else if (status === '204')
            res.status(204).end();
    } catch (err) {
        res.status(503).json({ error: `Generic error` }).end();
    }
});

router.delete('/positions', async (req, res) => {
    try {
        await positionService.deletePositions();
        res.status(204).end();
    } catch (err) {
        res.status(503).json({ error: `Generic error` }).end();
    }
});

module.exports = router;