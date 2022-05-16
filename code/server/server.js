'use strict';
const express = require('express');

const returnOrderRouter = require('./modules/routers/returnOrderRouter');
const positionRouter = require('./modules/routers/positionRouter');
const testDescriptorRouter = require('./modules/routers/testDescriptorRouter');
const itemRouter = require('./modules/routers/itemRouter');
const userRouter = require('./modules/routers/userRouter');
const internalOrderService = require('./modules/routers/internalOrderRouter');
const skuItemRouter = require('./modules/routers/SKUItemRouter');
const SKUAPIs = require('./modules/SKU');
const TestResultAPIs = require('./modules/testResult');

// init express
const app = new express();
const port = 3001;

app.use(express.json());
app.use('/api', returnOrderRouter);
app.use('/api', positionRouter);
app.use('/api', testDescriptorRouter);
app.use('/api', itemRouter);
app.use('/api', userRouter);
app.use('/api', internalOrderService);
app.use('/api', skuItemRouter);


//GET /api/test
app.get('/api/hello', (req, res) => {
  let message = {
    message: 'Hello World!'
  }
  return res.status(200).json(message);
});


SKUAPIs(app);
TestResultAPIs(app);










// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

module.exports = app;