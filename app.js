var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    User            = require("./models/user");
    seedDB          = require("./seeds");

// Requiring Routes
var commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes         = require("./routes/index");

mongoose.connect("mongodb+srv://sambhavAdmin:sambhavAdmin@cluster0-zgjaq.mongodb.net/yelpcamp?retryWrites=true&w=majority",{useNewUrlParser: true});
//mongoose.connect("mongodb://localhost:27017/yelpcamp_v13",{useNewUrlParser: true});
//mongoose.connect(process.env.DATABASEURL,{useNewUrlParser: true});


app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();        //seed the DATABASE

app.locals.moment = require("moment");

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//res.locals.currentUser will send this data in all the templates(ejs)
// req.user is feature from passport
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/",indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);

//DEFAULT ROUTE
app.get('*',function (req, res) {
    res.render("landing");
});

// app.listen(3000,function(){
//     console.log("YelpCamp Server has Started at Port 3000");
// });

//***************This method helps to define port to node-server by default **********/
app.listen(process.env.PORT,process.env.IP,function(){
    console.log("YelpCamp Server Started !");
});