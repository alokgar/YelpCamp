var express       =require("express");
var app           =express();
var path          = require("path");
var bodyParser    =require("body-parser");
var mongoose      =require("mongoose");
var passport      =require("passport");
var methodOverride=require("method-override");
var LocalStrategy = require("passport-local");
var Campground    = require("./models/campground");
var Comment       = require("./models/comment");
var User          = require("./models/user");
var seedDB        = require("./seeds");
//seedDB();

var commentRoutes=require("./routes/comments");
var campgroundRoutes=require("./routes/campgrounds");
var indexRoutes=require("./routes/index");
//PASSPORT CONFIG
app.use(require("express-session")({
    secret : "put on a happy face!!!",
    resave : false,
    saveUninitialized:false
}));
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
    });
    app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine","ejs");
app.set('views', path.join(__dirname, 'views'));
mongoose.connect("mongodb://localhost:27017/yelp_camp_v8",{useUnifiedTopology: true,useNewUrlParser: true});

app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use(indexRoutes);
     
//==================================================================================
app.listen(3000,function(){
    console.log("YelpCamp has started!!!");
});
