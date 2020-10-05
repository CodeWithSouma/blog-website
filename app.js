//jshint esversion:6
const config = require('config');
const helmet = require('helmet');
const compression = require('compression');
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require('mongoose');

const db = config.get('db');
mongoose.connect(db, {useNewUrlParser: true,useUnifiedTopology: true})
        .then(() => console.log(`Connected to ${db}...`));

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

//create a schema for post document
const postSchema = new mongoose.Schema({
  title:String,
  content:String
});

// create a model based on postSchema
const Post = new mongoose.model("Post",postSchema);

const app = express();
app.use(helmet());
app.use(compression());
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// home route get request 
app.get("/",function(req,res){
  Post.find({},function (err,foundPost) {
    res.render("home",{paragraph:homeStartingContent,allPost:foundPost});
  });
  
});

// about route get request 
app.get("/about",function(req,res){
  res.render("about",{paragraph:aboutContent});
});

// contact route get request 
app.get("/contact",function(req,res){
  res.render("contact",{paragraph:contactContent});
});

// compose route get request 
app.get("/compose",function(req,res){
  res.render("compose");
});

// /post/:parameter get route
app.get("/posts/:postID",function(req,res){
// collect post id from request 
  const postID = req.params.postID;
  //find thee document besed on post id and create a webpage using ejs post template and send back
  Post.findById(postID,function(err,foundPost){
    if(!err){
      if(foundPost){
        res.render("post",{postTitle:foundPost.title,postContent:foundPost.content});
      }
    }
  });
 

});

// compose post request
app.post("/compose",function(req,res){
  const postTitle = req.body.postTitle.trim();
  const postContent = req.body.postBody.trim();
  //create a new post using model
  const newPost = new Post({
    title:_.capitalize(postTitle),//use for convert string to title case
    content:postContent
  });
  newPost.save();
  console.log("Post was succesfully inserted into DB.");
  res.redirect("/"); 
});

const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log(`Server started on port ${port}...`);
});
