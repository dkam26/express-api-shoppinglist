'use strict';

const express = require('express');
const app = express();
const routes = require('./src/router');
const config = require('config');


const jsonParser = require('body-parser').json;
const morgan = require('morgan');

app.use(jsonParser());
app.use(morgan('dev'));


const mongoose = require('mongoose');
mongoose.connect(config.DBHost);
const db = mongoose.connection;
db.on('error', function(err) {
  console.error('connection error: ', err);
});
db.once('open', () =>{
  console.log('success');
});

if (config.util.getEnv('NODE_ENV') !== 'test') {
// use morgan to log at command line
  app.use(morgan('combined'));
// 'combined' outputs the Apache style LOGs
}

app.use('/shoppinglists', routes);

// 404 error handler
app.use((req, res, next) =>{
  const err = new Error('Not found');
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res, next)=>{
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
    },
  });
});


const port = process.env.PORT || 3000;

const server =app.listen(port, () =>{
  console.log('Express running ', port);
});

module.exports.app = server;
