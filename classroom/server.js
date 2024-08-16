const express= require("express");
const app= express();
const listing= require("../routes/listing");
const session=require("express-session")
const cookieParser=require("cookie-parser");

const sessionoptions = {
    secret : "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
}

app.use(session(sessionoptions));

app.get("/register" , (req,res)=>{
    let {name="anonymous"}= req.query;
    req.session.name=name;
    res.redirect("/hello");
});

app.get("/hello" , (req,res)=>{
    res.send(  ` Hello ${req.session.name}`);
})



app.get("/test" , (req,res)=>{
    res.send("test successfull");
})

app.listen(3000,()=>{
    console.log("server is listening to 3000")
});