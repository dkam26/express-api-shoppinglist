'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: String,
  firstname: String,
  secondname: String,
  password: String,
  lists: [{type: Schema.Types.ObjectId, ref: 'Shoppinglist'}],
});

const User = mongoose.model('User', UserSchema);

module.exports.User = User;
