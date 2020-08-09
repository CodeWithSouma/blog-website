//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/blogPostDB', {useNewUrlParser: true,useUnifiedTopology: true});

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

// this array for store all post object
let posts = [];

const app = express();

app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// home route get request 
app.get("/",function(req,res){
  console.log(Post.find({},function (err,foundPost) {
    console.log(foundPost);
    res.render("home",{paragraph:homeStartingContent,allPost:foundPost});
  }));
  
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
app.get("/posts/:postName",function(req,res){
  // chake post is present in posts array or not 

  posts.forEach(function(post){
    //using lodash module convert lower case string
    // example:_.lowerCase('--Foo-Bar--'); =>'foo bar'
    if( _.lowerCase(post.title) === _.lowerCase(req.params.postName)){
      res.render("post",{postTitle:post.title,postContent:post.content})
    };
 
  });
 

});

// compose post request
app.post("/compose",function(req,res){
  const postTitle = req.body.postTitle.trim();
  const postContent = req.body.postBody.trim();
  //create a new post using model
  const newPost = new Post({
    title:postTitle,
    content:postContent
  });
  newPost.save();
  console.log("Post was succesfully inserted into DB.");
  res.redirect("/"); 
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
