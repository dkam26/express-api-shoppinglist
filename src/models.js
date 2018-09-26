'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const shoppinglistSchema = new Schema({
  name: String,
  owner: {type: Schema.Types.ObjectId, ref: 'User'},
});

const UserSchema = new Schema({
  username: String,
  firstname: String,
  secondname: String,
  password: String,
  lists: [{type: Schema.Types.ObjectId, ref: 'Shoppinglist'}],
});

const User = mongoose.model('User', UserSchema);
const Shoppinglist = mongoose.model('Shoppinglist', shoppinglistSchema);

module.exports.User = User;
module.exports.Shoppinglist = Shoppinglist;
