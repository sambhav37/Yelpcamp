var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware");

// ROOT route
router.get("/",function(req,res){
    res.render("landing");
});

// REGISTER FORM Route
router.get("/register",function(req,res){
    res.render("register",{page: 'register'});
});

//handle sign up logic
router.post("/register",function(req,res){
    var newUser = new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success", "Successfully Signed Up! Nice to meet you " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

//LOGIN FORM Route
router.get("/login",function(req,res){
    res.render("login",{page: 'login'});
});

//handling login logic
router.post("/login",passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req,res){
});

//LOGOUT Route
router.get("/logout",function(req,res){
    req.logout();
    req.flash("success","Logged You Out!");
    res.redirect("/campgrounds");
});

module.exports = router;