'use strict';

var express = require("express");
var router = express.Router();


router.post("/login", function(req, res){
    res.json({response: "Login"});
});

router.get("/lists", function(req, res){
    res.json({
        response: "shoppinglist"});
});

router.get("/list/:id", function(req, res){
    res.json({
        response: "shoppinglist"});
});

module.exports = router;