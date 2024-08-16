const express = require("express");
const router= express.Router();
const Listing= require("../models/listing.js");
const wrapAsync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/ExpressError.js");
const flash= require("connect-flash");
const path= require("path");
const {isLoggedIn,isOwner,validatelisting} = require("../middleware.js");
const listingController= require("../controllers/listing.js");
const multer=require("multer");
const {storage} = require("../cloudConfig.js");
const upload= multer({ storage });


router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single('listing[image]'), wrapAsync(listingController.createListing));




router.get("/new" , isLoggedIn, listingController.renderNewForm);


router.get("/:id/edit" ,
    isLoggedIn,
    isOwner,
     wrapAsync(listingController.editListing));


router.route("/:id")
.get(wrapAsync( listingController.showListing))
.put(isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    wrapAsync(listingController.updateListing))
.delete(isLoggedIn ,
        isOwner,
         wrapAsync(listingController.deleteListing)); 



router.use((err,req,res,next) => {
    let {statusCode=500,message="Some thing went wrong"} = err;
        res.render("listings/error.ejs",{message})
   });


module.exports = router;