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
            const {username, firstname, secondname, password} = req.body;
            if(username && firstname && secondname && password){
                    if(users.length > 0){
                        return res.json({message: `User already exists, ${req.body.username }`});
                        
                    } else{ 
                        var user =  new Users(req.body);
                        user.save();
                        return res.json({message: `User successfully added!, ${req.body.username }`});   
                       }
            }else{
                return res.json({message: 'Missing fields!'});
            }

        })  
        
    })
      //login endpoint
      .post("/login", function(req, res){
        const {username, password} = req.body;
        if(username && password){
                    Users.find({"username":req.body.username,"password":req.body.password}, (err, users) =>{
                        if(users.length === 0){
                            return res.json({Message:'Wrong credentials'})
                        }else{
                            var token = jwt.sign({id:users[0]._id},'super', {
                                expiresIn: 86400
                            });
                            return res.json({'user': req.body.username, 'token':token})
                        }
                        
                    })
        }else{
            return res.json({Message: 'Missing fields!'});
        }
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
                    if (list.length === 0){
                        return res.json({'Message': 'No lists'})
                    }else{
                        return res.status(201).send(list)
                    }
                    
                })

            });
               
        })
    })
     //Add shoppinglist endpoint
      .post("/auth/addlist/", (req, res) =>{
        const name = req.body.name
        var token = req.headers['x-access-token'];
        if(!token) return res.status(401).send({auth: false, mesaage: 'No token provided.'})
        jwt.verify(token, 'super', function(err, decoded) {
           if (err) return res.status(500).send({
               auth: false,
               message: 'Failed to authenticate token.'
           });
           if(name){
                Users.find({"_id":decoded.id}, (err, user) =>{
                    Shoppinglists.find({'owner':user[0]._id,'name':name}, (err, list) =>{
                        if(list.length > 0){
                            return res.status(201).json({'Message': `List exists!, ${req.body.name }`} )
                        }else{
                        var addlist =  new Shoppinglists({'name':name, 'owner':user[0]._id});
                        addlist.save();

                        return res.status(201).json({'Message': `List successfully added!, ${req.body.name }`} )
                        }
                    })
                });
            }else{
                return res.json({'Message': 'Missing fields!'})
            }
               
        })
    })
       //Update shoppinglist endpoint
        .put("/auth/update/", (req, res) =>{
        var token = req.headers['x-access-token'];
        const {name, newName} = req.body
        if(!token) return res.status(401).send({auth: false, mesaage: 'No token provided.'})
        jwt.verify(token, 'super', function(err, decoded) {
            if (err) return res.status(500).send({
                auth: false,
                message: 'Failed to authenticate token.'
            });
            if(name && newName){
            Users.find({"_id":decoded.id}, (err, user) =>{
                Shoppinglists.find({'owner':user[0]._id,'name':name}, (err, list) =>{
                    if(list.length > 0){
                        console.log(list)
                        Shoppinglists.where({'name':name, 'owner':user[0]._id}).update({
                             $set: {name:newName}
                         }).exec();
                         return res.status(201).send({message:` list updated `})   
                    }else{
                        return res.json({'Message': 'List doesnt exist'})
                        }
                })
            });
        }else{
            return res.json({'Message': 'Missing fields!'})
        }
        })
    })
       //Delete shoppinglist endpoint
        .delete("/auth/delete", (req, res) => {
            var name = req.body.name
            var token = req.headers['x-access-token'];
            if(!token) return res.status(401).send({auth: false, mesaage: 'No token provided.'})
            jwt.verify(token, 'super', function(err, decoded) {
                if (err) return res.status(500).send({
                    auth: false,
                    message: 'Failed to authenticate token.'
                });
                if(name){
                        Users.find({"_id":decoded.id}, (err, user) =>{
                            Shoppinglists.find({'owner':user[0]._id,'name':name}, (err, list) =>{
                                if(list.length > 0){
                                    console.log(list)
                                    Shoppinglists.find({'name':req.body.name, 'owner':user[0]._id}).remove().exec();
                                    return res.status(201).send({Message:` list deleted `})
                                    
                                    }else{
                                        return res.json({'Message': 'List doesnt exist'})
                                        }
                            })
                        });
                }else{
                    return res.json({'Message': 'Missing fields!'})
                }
            })

        });
module.exports = router;