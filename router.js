'use strict';

const express = require("express");

const jwt = require('jsonwebtoken');

const router = express.Router();
const Users =  require('./models').User
const Shoppinglists =   require('./models').Shoppinglist


   

    router
      .post("/signup", (req, res) =>{
        Users.find({"username":req.body.username},(err, users) =>{
            if(users){
                res.send(`${req.body.username} user already exists`)
            } else{
                var user =  new Users(req.body);
                user.save();
                res.status(201).send(`${req.body.username} user created `)
            }

        })  
        
    })
      .post("/login", function(req, res){
        Users.find({"username":req.body.username}, (err, users) =>{
            if(users.length === 0){
                res.send(`${req.body.username} user doesnt existed`)
            }else{
                var token = jwt.sign({id:users[0]._id},'super', {
                    expiresIn: 86400
                });
                console.log(token)
                res.json({'user': req.body.username, 'token':token})
            }
            
        })
    })
      .get("/auth/lists/", function(req, res){
        var token = req.headers['x-access-token'];
        if(!token) return res.status(401).send({auth: false, mesaage: 'No token provided.'})
        jwt.verify(token, 'super', function(err, decoded) {
           if (err) return res.status(500).send({
               auth: false,
               message: 'Failed to authenticate token.'
           });
           Users.find({"_id":decoded.id}, (err, user) =>{
                Shoppinglists.find({'owner':user[0]._id}, (err, list) =>{
                    console.log(list.length)
                    res.status(201).send(list)
                })

            });
               
        })
    })
      .post("/auth/addlist/", (req, res) =>{
        var token = req.headers['x-access-token'];
        if(!token) return res.status(401).send({auth: false, mesaage: 'No token provided.'})
        jwt.verify(token, 'super', function(err, decoded) {
           if (err) return res.status(500).send({
               auth: false,
               message: 'Failed to authenticate token.'
           });
           Users.find({"_id":decoded.id}, (err, user) =>{
                  var list =  new Shoppinglists({'name':req.body.name, 'owner':user[0]._id});
                  list.save();
                  res.status(201).send(` user created `)
            });
               
        })
    })
        .put("/auth/update/", (req, res) =>{
        var token = req.headers['x-access-token'];
        if(!token) return res.status(401).send({auth: false, mesaage: 'No token provided.'})
        jwt.verify(token, 'super', function(err, decoded) {
            if (err) return res.status(500).send({
                auth: false,
                message: 'Failed to authenticate token.'
            });
            Users.find({"_id":decoded.id}, (err, user) =>{
                Shoppinglists.where({'name':req.body.name, 'owner':user[0]._id}).update({
                    $set: {name:req.body.newName}
                }).exec();
                res.status(201).send(` list updated `)
          });

        })
    });
module.exports = router;