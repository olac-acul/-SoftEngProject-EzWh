'use strict';
const express = require('express');
const { path } = require('express/lib/application');
const { param } = require('express/lib/request');
const ReturnOrder = require('./modules/returnOrder');

const returnOrderDb = new ReturnOrder();

// init express
const app = new express();
const port = 3001;

app.use(express.json());

//GET /api/test
app.get('/api/hello', (req, res) => {
  let message = {
    message: 'Hello World!'
  }
  return res.status(200).json(message);
});

// ************************** Return Order *******************************
//GET
app.get('/api/returnOrders', async (req, res) => {
  try {
    const returnOrders = await returnOrderDb.getReturnOrders();
    res.status(200).json(returnOrders);
  } catch (err) {
    res.status(401).end();
  }
});

app.get('/api/returnOrders/:id', async (req, res) => {
  let id = Number(req.params.id);
  try {
    const returnOrder = await returnOrderDb.getReturnOrderById(id);
    res.status(200).json(returnOrder);
  } catch (err) {
    res.status(404).end();
  }
});

//POST
app.post('/api/returnOrder', async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(422).json({ error: `Unprocessable Entity` });
  }
  let returnOrder = req.body.returnOrder;
  await returnOrderDb.newTable();
  returnOrderDb.createReturnOrder(returnOrder);
  return res.status(201).end();
});

//DELETE
app.delete('/api/returnOrder/:id', async (req, res) => {
  let id = Number(req.params.id);
  try {
  returnOrderDb.deleteReturnOrder(id);
  res.status(204).end();
  } catch (err) {
    res.status(500).end();
  }
});








// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

module.exports = app;