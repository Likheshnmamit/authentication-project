//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");

const app = express();
mongoose.connect("mongodb://localhost:27017/userDB");
const userschema=new mongoose.Schema({
  email:String,
  password:String
});
console.log(process.env.API_KEY);
userschema.plugin(encrypt, {secret:process.env.SECRET, encryptedFields: ['password']});

const User=mongoose.model("User",userschema);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});


app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){
  const username=req.body.username;
  const password=req.body.password;
  const newuser=new User({
    email:username,
    password:password
  });
  newuser.save(function(err){
    if(!err){
      res.render("secrets");
    }else{
      console.log(err);
    }
  });
});

app.post("/login",function(req,res){
  const username=req.body.username;
  const password=req.body.password;
  User.findOne({email:username},function(err,founduser){
    if(err){
      console.log(err);
    }else{
        if(founduser.password===password){
          res.render("secrets");
        }
      }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
