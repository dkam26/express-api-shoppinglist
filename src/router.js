import express from 'express';

import jwt from 'jsonwebtoken';

const router = new express.Router();
import User from './user.models';
import Shoppinglist from './shoppinglist.models';


router
// Signup endpoint
    .post('/signup', (req, res) =>{
      User.find({'username': req.body.username}, (err, users) =>{
        const {username, firstname, secondname, password} = req.body;
        if (username && firstname && secondname && password) {
          if (users.length > 0) {
            return res.json({
              message: `User already exists, ${req.body.username }`,
            });
          } else {
            const user = new User(req.body);
            user.save();
            return res.json({
              message: `User successfully added!, ${req.body.username }`});
          }
        } else {
          return res.json({message: 'Missing fields!'});
        }
      });
    })
// login endpoint
    .post('/login', (req, res)=>{
      const {username, password} = req.body;
      if (username && password) {
        User.findOne({
          'username': req.body.username,
          'password': req.body.password}, (err, users) =>{
          if (users === null) {
            return res.json({Message: 'Wrong credentials'});
          } else {
            const token = jwt.sign({id: users._id}, 'super', {
              expiresIn: 86400,
            });
            return res.json({'user': req.body.username, 'token': token});
          }
        });
      } else {
        return res.json({Message: 'Missing fields!'});
      }
    })
// all lists endpoints
    .get('/auth/lists/', (req, res) => {
      const token = req.headers['x-access-token'];
      if (!token) {
        return res.status(401).send({
          auth: false, mesaage: 'No token provided.'});
      }
      jwt.verify(token, 'super', function(err, decoded) {
        if (err) {
          return res.status(500).json({
            auth: false,
            message: 'Failed to authenticate token.',
          });
        }
        User.find({'_id': decoded.id}, (err, user) =>{
          Shoppinglist.find({'owner': user[0]._id}, (err, list) =>{
            if (list.length === 0) {
              return res.json({'Message': 'No lists'});
            } else {
              return res.status(201).send(list);
            }
          });
        });
      });
    })
// Add shoppinglist endpoint
    .post('/auth/addlist/', (req, res) =>{
      const name = req.body.name;
      const token = req.headers['x-access-token'];
      if (!token) {
        return res.status(401).send({
          auth: false,
          mesaage: 'No token provided.'});
      }
      jwt.verify(token, 'super', function(err, decoded) {
        if (err) {
          return res.status(500).send({
            auth: false,
            message: 'Failed to authenticate token.',
          });
        }
        if (name) {
          User.findOne({'_id': decoded.id}, (err, user) =>{
            console.log(user._id);
            Shoppinglist.find({
              'owner': user._id,
              'name': name}, (err, list) =>{
              if (list.length > 0) {
                return res.status(201).json({
                  'Message': `List exists!, ${req.body.name }`} );
              } else {
                const addlist = new Shoppinglist({
                  'name': name,
                  'owner': user._id});
                addlist.save();
                return res.status(201).json({
                  'Message': `List successfully added!, ${req.body.name }`});
              }
            });
          });
        } else {
          return res.json({'Message': 'Missing fields!'});
        }
      });
    })
// Update shoppinglist endpoint
    .put('/auth/update/', (req, res) =>{
      const token = req.headers['x-access-token'];
      const {name, newName} = req.body;
      if (!token) {
        return res.status(401).send({
          auth: false,
          mesaage: 'No token provided.'});
      }
      jwt.verify(token, 'super', function(err, decoded) {
        if (err) {
          return res.status(500).send({
            auth: false,
            message: 'Failed to authenticate token.',
          });
        }
        if (name && newName) {
          User.findOne({'_id': decoded.id}, (err, user) =>{
            Shoppinglist.find({
              'owner': user._id,
              'name': name}, (err, list) =>{
              if (list.length > 0) {
                Shoppinglist.where({
                  'name': name,
                  'owner': user._id}).update({
                  $set: {name: newName},
                }).exec();
                return res.status(201).send({message: ` list updated `});
              } else {
                return res.json({'Message': 'List doesnt exist'});
              }
            });
          });
        } else {
          return res.json({'Message': 'Missing fields!'});
        }
      });
    })
// Delete shoppinglist endpoint
    .delete('/auth/delete', (req, res) => {
      const name = req.body.name;
      const token = req.headers['x-access-token'];
      if (!token) {
        return res.status(401).send({
          auth: false,
          mesaage: 'No token provided.'});
      }
      jwt.verify(token, 'super', function(err, decoded) {
        if (err) {
          return res.status(500).send({
            auth: false,
            message: 'Failed to authenticate token.',
          });
        }
        if (name) {
          User.findOne({'_id': decoded.id}, (err, user) =>{
            Shoppinglist.find({
              'owner': user._id,
              'name': name}, (err, list) =>{
              if (list.length > 0) {
                Shoppinglist.find({
                  'name': req.body.name,
                  'owner': user._id}).remove().exec();
                return res.status(201).send({Message: ` list deleted `});
              } else {
                return res.json({'Message': 'List doesnt exist'});
              }
            });
          });
        } else {
          return res.json({'Message': 'Missing fields!'});
        }
      });
    });
export default router;
