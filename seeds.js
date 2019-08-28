var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {
        name:"Salmon Creek",
        image:"https://www.northiceland.is/static/toy/images/2684_1___Selected.jpg",
        description:"Best Salmons Available"
    },
    {
        name:"Granite Hill",
        image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3J-z3SrT6CT1phyJGKx6JSz711qh8EjNhyijzo9HMaB-98OlD",
        description: "Big Granite hills all around the valley and very nice weather."
    },
    {
        name:"Mountain Goat",
        image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUjmPyPhvk7KIFMkJ9amvYBGCpxWO8rlcNh_e-vqXCo5b3heIA",
        description: "Goats all around the lush green valley is a treat to watch in summers."
    }
];

function seedDB(){
    //Remove All Campgrounds
    Campground.remove({},function(err){
        if(err){
            console.log(err);
        }else{
            console.log("Campgrounds Removed !!!");
            //ADD a few Campgrounds
            data.forEach(function(seed){
                Campground.create(seed,function(err,campground){
                    if(err){
                        console.log(err);
                    }else{
                        console.log("Added 1 Campground !");
                        //ADD a few Comments
                        Comment.create(
                            {
                                text: "This place is great but I wish there was Internet!",
                                author: "Homer"
                            },function(err,comment){
                                if(err){
                                    console.log(err);
                                }else{
                                    campground.comments.push(comment);
                                    campground.save();
                                    console.log("Created new Comment !");
                                }
                            });
                    }
                });
            });
        }
    });
}
module.exports = seedDB;



//NESTED ROUTES

//NEW     /campgrounds/:id/comments/new     GET
//CREATE  /campgrounds/:id/comments         POST


//INDEX   /campgrounds                      GET
//NEW     /campgrounds/new                  GET
//CREATE  /campgrounds                      POST
//SHOW    /campgrounds/:id                  GET