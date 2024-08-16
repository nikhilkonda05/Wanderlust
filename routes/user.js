const express = require("express");
const router= express.Router();
const User= require("../models/user.js");
const wrapAsync = require("../utils/wrapasync.js");
const { redirect } = require("express/lib/response.js");
const passport= require("passport");
const { isLoggedIn } = require("../middleware.js");
const userController = require("../controllers/user.js");


router.route("/signup")
.get( (userController.renderSignupForm))
.post(
    wrapAsync(userController.signup )
);


router.route("/login")
.get((userController.renderLoginForm))
.post(passport.authenticate('local', {
      failureRedirect: '/login',
      failureFlash: true,
    }),
    async(req,res)=>{
        // console.log(`${req.User}`)
        req.flash("success" ,"  signed in successfully !!");
        
       res.redirect('/listings');          
    }
  );

router.get("/logout",isLoggedIn, (userController.logout) );

module.exports=router;