require('dotenv').config();


const express = require("express");
const app= express();
const mongoose = require("mongoose");
const path= require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const { nextTick } = require("process");
const session =require("express-session");
const MongoStore = require('connect-mongo');
const bodyParser=require("body-parser");
const cookieParser=require("cookieparser");
const flash= require("connect-flash");
const ExpressError = require("./utils/ExpressError.js");
const passport= require("passport");
const LocalStrategy= require("passport-local");
const User=require("./models/user.js");



const listingRouter=require("./routes/listing.js");
const ReviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const { error } = require("console");
const wrapAsync = require("./utils/wrapasync.js");
const { Http2ServerRequest } = require("http2");


app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs" , ejsMate)
app.use(express.static(path.join(__dirname,"/public")));
app.use(flash());

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const dbURL= process.env.ATLASDB_URL



async function main(){
    await mongoose.connect(dbURL)
}

main().then(()=>{
    console.log("connected to data base")
}).catch((err)=>{
    console.log(err);

});
const store = MongoStore.create({
    mongoUrl:dbURL,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600
})

const sessionoptions = {
    store,
    secret : process.env.SECRET,
    resave: false,
    saveUninitialized: true,
}




app.use(session(sessionoptions));

app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(User.authenticate()));


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser = req.user;
    next();
});
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/listings" ,listingRouter);
app.use("/listings/:id/reviews" , ReviewRouter);
app.use("/",userRouter);

  
  app.use((err,req,res,next) => {
  let {statusCode=500,message="Some thing went wrong !"}= err;
       res.status(statusCode).render("listings/error.ejs",{message});
  });

  
app.all("*", wrapAsync((req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
  }));

  app.listen(8080,()=>{
    console.log("server is running on port 8080")
});
