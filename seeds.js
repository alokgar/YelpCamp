var mongoose=require("mongoose");
var Campground  = require("./models/campground");
var Comment = require("./models/comment")

var data =[
    {
        name :  "yellow canopy",
        image : "https://images.unsplash.com/photo-1531675973208-3e54d1732662?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60",
        description : "first canopy"
    },
    {
        name :  "yellow canopy",
        image : "https://images.unsplash.com/photo-1531675973208-3e54d1732662?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60",
        description : "second canopy"
    }

]

function  seedDB(){
Campground.remove({},function(err){
   if(err){
        console.log(err);
    }
    else{
        console.log("camgrounds removed !!!");
        data.forEach(function(seed){
            Campground.create(seed,function(err,campground){
                if(err){console.log(err);}
                else{
                    console.log("created a campground!!!");
                    Comment.create(
                        {
                            text: "wringalium leviosa ::: alohmora!!",
                            author:  "harmoine grenger"

                        },function(err,comment){
                            if(err){console.log(err);}
                            else{
                                campground.comments.push(comment);
                                campground.save();
                                console.log("added a comment");
                            }
                        }
                    )
                }
            });
        });

    }
});
}

module.exports =seedDB;