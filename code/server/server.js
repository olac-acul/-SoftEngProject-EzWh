'use strict';
const express = require('express');

const returnOrderRouter = require('./modules/routers/returnOrderRouter');
const positionRouter = require('./modules/routers/positionRouter');
const testDescriptorRouter = require('./modules/routers/testDescriptorRouter');
const itemRouter = require('./modules/routers/itemRouter');
const userRouter = require('./modules/routers/userRouter');
const internalOrderRouter = require('./modules/routers/internalOrderRouter');
const skuItemRouter = require('./modules/routers/SKUItemRouter');
const skuRouter = require('./modules/routers/SKURouter');
const testResultRouter = require('./modules/routers/testResultRouter');
const restockOrderRouter = require('./modules/routers/restockOrderRouter');

// init express
const app = new express();
const port = 3001;

app.use(express.json());
app.use('/api', returnOrderRouter);
app.use('/api', positionRouter);
app.use('/api', testDescriptorRouter);
app.use('/api', itemRouter);
app.use('/api', userRouter);
app.use('/api', internalOrderRouter);
app.use('/api', skuItemRouter);
app.use('/api', skuRouter);
app.use('/api', testResultRouter);
app.use('/api', restockOrderRouter);


//GET /api/test
app.get('/api/hello', (req, res) => {
  let message = {
    message: 'Hello World!'
  }
  return res.status(200).json(message);
});

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

module.exports = app;