'use strict';
var express = require("express");
var app = express();
var routes = require('./router');
// var jsonParser = require("body-parser").json;

// app.use(jsonParser);

app.use('/shoppinglists', routes);

var port  = process.env.PORT || 3000;

app.listen(port, function(){
    console.log("Express running ",port)
})