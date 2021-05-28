var express  = require("express");
var router   =  express.Router();
var Campground    = require("../models/campground");
var Comment       = require("../models/comment");
var User          = require("../models/user"); 
var passport      =require("passport");
var path          = require("path");

//show all campgrounds from DB
router.get("/",function(req,res){   
    Campground.find({},function(err,allCampgrounds){
        if(err){
                console.log(err);
        }
        else{
            res.render(path.resolve(__dirname + "/../campgrounds/views/campgrounds"), {campgrounds:allCampgrounds,currentUser:req.user});
        }
    })
});
//show  form for adding  new  campground
router.get("/new",isLoggedIn,function(req,res){
    res.render(path.resolve(__dirname + "/../campgrounds/views/new"),);
});
//handle new  campground and save to DB
router.post("/",isLoggedIn,function(req,res){
    var name=req.body.name;
    var image=req.body.image;
    var desc =req.body.description;
    var  author = {
        id:req.user._id ,
        username:req.user.username
    }
    var newCampground={name:name ,image: image , description : desc,author:author};
    //create a new campground and save to DB
    Campground.create(newCampground, function(err,newlyCreated){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/campgrounds");
        }
    });
});

//SHOW ROUTE: show more information  about  one  campground

router.get("/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log(err);
        }
        else{
            console.log(foundCampground);
            res.render(path.resolve(__dirname + "/../campgrounds/views/show"),{campground:foundCampground,currentUser:req.user});
        }
    });
    
});

//edit  route
router.get("/:id/edit",checkCampgroundOwnership,function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
            res.render(path.resolve(__dirname + "/../campgrounds/views/edit"),{campground:foundCampground,currentUser:req.user});
    });
});
//UPDATE ROUTE
router.put("/:id",checkCampgroundOwnership,function(req,res){
    //find and update the campground
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedcamp){
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
});
//DESTROY  CAMPGROUNDS
router.delete("/:id",checkCampgroundOwnership,function(req,res){
    //find and update the campground
    Campground.findByIdAndRemove(req.params.id,req.body.campground,function(err,updatedcamp){
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds/");
        }
    })
});

//middleware authentication
function checkCampgroundOwnership(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err,foundCampground){
            if(err){
                    res.redirect("/campgrounds");
            }
            else{
                //does user  own the campground
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    res.redirect("back")
                }
            }
    
        });
    }
    else{
        res.redirect("back")
    }

}

//middleware authentication
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return  next();
    }
    res.redirect("/login");
}

module.exports = router;