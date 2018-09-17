'use strict';

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// var productSchema = new Schema({
//     product: String,
//     quantity: Number,
//     amount: Number, 
// });

var shoppinglistSchema = new Schema({
    name: String,
    owner: { type: Schema.Types.ObjectId, ref: 'User'}
});

var UserSchema = new Schema({
    username: String,
    firstname: String,
    secondname: String,
    password: String,
    lists:[{ type: Schema.Types.ObjectId, ref: 'Shoppinglist'}]
})

var User = mongoose.model("User", UserSchema);
var Shoppinglist = mongoose.model("Shoppinglist", shoppinglistSchema);

module.exports.User = User;
module.exports.Shoppinglist = Shoppinglist;