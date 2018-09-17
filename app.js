'use strict';
const express = require("express");
const app = express();
const routes = require('./router');


const jsonParser = require("body-parser").json;
const logger = require("morgan")

app.use(jsonParser());
app.use(logger("dev"));


var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/shoppinglists");
const db = mongoose.connection;
db.on("error", function(err){
   console.error("connection error: ", err);
});

db.once("open", function(){
    console.log("success");
});


app.use('/shoppinglists', routes);

//404 error handler
app.use(function(req, res, next){
    var err = new Error("Not found");
    err.status = 404;
    next(err);
});

//Error handler
app.use(function(err, req, res, next){
   res.status(err.status || 500);
   res.json({
       error: {
           message: err.message
       }
   });
});

// session handler


var port  = process.env.PORT || 3000;

app.listen(port, function(){
    console.log("Express running ",port)
})