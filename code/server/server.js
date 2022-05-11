'use strict';
const express = require('express');
const ReturnOrderAPIs = require('./modules/returnOrder');
const PositionAPIs = require('./modules/position');
const TestDescriptorAPIs = require('./modules/testDescriptor');
const ItemAPIs = require('./modules/item');
const UserAPIs = require('./modules/user');
const InternalOrder = require('./modules/internalOrder');
const SKUItemAPIs = require('./modules/SKUItem');


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


ReturnOrderAPIs(app);
PositionAPIs(app);
TestDescriptorAPIs(app);
ItemAPIs(app);
UserAPIs(app);
InternalOrder(app);
SKUItemAPIs(app);










// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

module.exports = app;