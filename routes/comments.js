var express  = require("express");
var router   =  express.Router({mergeParams:true});
var Campground    = require("../models/campground");
var Comment       = require("../models/comment");
var User          = require("../models/user");
var passport      =require("passport");
var path          = require("path");
//new comment
router.get("/new",isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err){
            console.log(err);
        }
        else{
            res.render(path.resolve(__dirname + "/../comments/views/new"),{campground:foundCampground});
        }
    });
    
});
// handles new comment
router.post("/",isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err){
            console.log(err);
        }
        else{
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err);
                }
                else{
                    //add username  and id to comment and save it
                    comment.author.id=req.user._id;
                    comment.author.username=req.user.username;
                    comment.save();
                    foundCampground.comments.push(comment);
                    foundCampground.save();
                    res.redirect("/campgrounds/"+foundCampground._id);
                }
            });
        }
    });
    
});

//EDIT  ROUTE FOR  COMMENT
router.get("/:comment_id/edit",checkCommentOwnership,function(req,res){
    Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err){
            res.redirect("back");
        }
        else{
            res.render(path.resolve(__dirname + "/../comments/views/edit"),{campground_id:req.params.id , comment:foundComment});
        }
        
    })

});

//UPDATE YOUR  ROUTE
router.put("/:comment_id",checkCommentOwnership,function(req,res){
    //find and update the campground
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedcamp){
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});
//DELETE  ROUTE
router.delete("/:comment_id",checkCommentOwnership,function(req,res){
    //find and update the campground
    Comment.findByIdAndRemove(req.params.comment_id,function(err,updatedcamp){
        if(err){
            res.redirect("back");
        }
        else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

//middleware authentication
function checkCommentOwnership(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err,foundComment){
            if(err){
                    res.redirect("/campgrounds");
            }
            else{
                //does user  own the comment
                if(foundComment.author.id.equals(req.user._id)){
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