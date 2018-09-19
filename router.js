'use strict';

const express = require("express");

const jwt = require('jsonwebtoken');

const router = express.Router();
const Users =  require('./models').User
const Shoppinglists =   require('./models').Shoppinglist


   

    router
      //Signup endpoint
      .post("/signup", (req, res) =>{
        Users.find({"username":req.body.username},(err, users) =>{
            if(users.length > 0){
                return res.json({message: `User already exists, ${req.body.username }`});
                
            } else{
                var user =  new Users(req.body);
                user.save();
                return res.json({message: `User successfully added!, ${req.body.username }`});
                
            }

        })  
        
    })
      //login endpoint
      .post("/login", function(req, res){
        Users.find({"username":req.body.username,"password":req.body.password}, (err, users) =>{
            if(users.length === 0){
                return res.json({message:`${req.body.username} user doesnt existed`})
            }else{
                var token = jwt.sign({id:users[0]._id},'super', {
                    expiresIn: 86400
                });
                return res.json({'user': req.body.username, 'token':token})
            }
            
        })
    })
      // all lists endpoints
      .get("/auth/lists/", function(req, res){
        var token = req.headers['x-access-token'];
        
        if(!token) return res.status(401).send({auth: false, mesaage: 'No token provided.'})
        jwt.verify(token, 'super', function(err, decoded) {
           if (err) return res.status(500).json({
               auth: false,
               message: 'Failed to authenticate token.'
           });
           Users.find({"_id":decoded.id}, (err, user) =>{
                Shoppinglists.find({'owner':user[0]._id}, (err, list) =>{
                    console.log(list.length)
                    return res.status(201).send(list)
                })

            });
               
        })
    })
     //Add shoppinglist endpoint
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
                  return res.status(201).send({message: `User successfully added!, ${req.body.username }`} )
            });
               
        })
    })
       //Update shoppinglist endpoint
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
                return res.status(201).send(` list updated `)
          });

        })
    })
       //Delete shoppinglist endpoint
        .delete("/auth/delete", (req, res) => {
            var token = req.headers['x-access-token'];
            if(!token) return res.status(401).send({auth: false, mesaage: 'No token provided.'})
            jwt.verify(token, 'super', function(err, decoded) {
                if (err) return res.status(500).send({
                    auth: false,
                    message: 'Failed to authenticate token.'
                });
                Users.find({"_id":decoded.id}, (err, user) =>{
                    Shoppinglists.find({'name':req.body.name, 'owner':user[0]._id}).remove().exec();
                    return res.status(201).send(` list deleted `)
              });
            })

        });
module.exports = router;