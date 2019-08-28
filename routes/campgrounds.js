var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
//no need to give whole path because index.js is automatically required

//INDEX ROUTE Show All Campgrounds
router.get("/",function(req,res){
    //res.render("campgrounds",{campgrounds:campgrounds});
    //get all campground from db
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index",{campgrounds: allCampgrounds, page: 'campgrounds'});
        }
    });
});

//CREATE ROUTE ADD NEW Campground
router.post("/",middleware.isLoggedIn,function(req,res){
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name:name,price:price,image:image,description:desc,author: author};
    //create new entry and save in db
    Campground.create(newCampground,function(err,newlyCreated){
        if(err){
            console.log(err);
        }else{
            res.redirect("/campgrounds"); //called as the set default GET request
        }
    });
});

//NEW ROUTE ADDS A NEW Campground
router.get("/new",middleware.isLoggedIn,function(req,res){
    res.render("campgrounds/new");
});

//SHOW ROUTE /campgrounds/:id more infoabout one campground
router.get("/:id",function(req,res){
    //find the campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err || !foundCampground){
            console.log(err);
            req.flash("error","Campground not found");
            res.redirect("back");
        }else{
                console.log(foundCampground);
                //render show template with the info
                res.render("campgrounds/show",{campground: foundCampground});
            }
    });
});

//  EDIT Campground Route
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
        res.render("campgrounds/edit",{campground: foundCampground});
    }); 
});

//  UPDATE Campground Route
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
    //find and update correct campground
    Campground.findByIdAndUpdate(req.params.id,req.body.campground, function(err,updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
    //redirect 
});

// DESTROY Campground route
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    });
});

//DEFAULT ROUTE
router.get('*',function (req, res) {
    res.redirect("/");
});

module.exports = router;
