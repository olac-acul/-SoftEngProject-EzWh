'use strict';
const express = require('express');

const ReturnOrderAPIs = require('./modules/returnOrder');
const positionRouter = require('./modules/routers/positionRouter');
const TestDescriptorAPIs = require('./modules/testDescriptor');
const ItemAPIs = require('./modules/item');
const UserAPIs = require('./modules/user');
const InternalOrder = require('./modules/internalOrder');
const SKUItemAPIs = require('./modules/SKUItem');
const SKUAPIs = require('./modules/SKU');


// init express
const app = new express();
const port = 3001;

app.use(express.json());
app.use('/api', positionRouter);

//GET /api/test
app.get('/api/hello', (req, res) => {
  let message = {
    message: 'Hello World!'
  }
  return res.status(200).json(message);
});


ReturnOrderAPIs(app);
TestDescriptorAPIs(app);
ItemAPIs(app);
UserAPIs(app);
InternalOrder(app);
SKUItemAPIs(app);
SKUAPIs(app);










// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

module.exports = app;