const express = require("express");
const router= express.Router({mergeParams:true});
const Listing = require("../models/listing.js");
const Review= require("../models/review.js");
const wrapAsync = require("../utils/wrapasync.js");


router.post("/", (async(req,res)=>{
    let listing = Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    console.log(newReview);

    listing.reviews.push({newReview});
    await newReview.save();
    await listing.save();

    console.log("new review SAved !");
    req.flash("Review Saved successfully!")
    res.redirect(`/listings/${listing._id}`);
}));

module.exports = router;