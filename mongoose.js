// 'use strict';
// var mongoose = require("mongoose");
// mongoose.connect("mongodb://localhost:27017/shoppinglists");
// var db = mongoose.connection;
// db.on("error", function(err){
//    console.error("connection error: ", err);
// });

// db.once("open", function(){
//     console.log("success");
//     var Schema = mongoose.Schema;
//     var UserSchema = new Schema({
//         username: String,
//         firstname: String,
//         secondname: String,
//         email: {
//             work: {type: mongoose.SchemaTypes.Email, required: true}

//         }
//     });
//     var lists = mongoose.model("lists", ShopplistSchema);

//     var first = new lists({
//            name: "trousers"
//         })
//     first.save(function(err){
//         if (err) console.error("save failed", err);
//         else console.log("Saved!");
//         db.close(function(){
//             console.log("db closed")
//         });
//     })
  
// });