const User=require("../models/user");

module.exports.renderSignupForm=(req,res) =>{
    res.render("users/signup.ejs")
};

module.exports.signup=async(req,res)=>{
    try{
let {username,email,password} = req.body;
const newUser= new User({email,username});
let registedUser= await User.register(newUser,password);
console.log(registedUser);
req.login(registedUser,(err)=>{
    if(err){
        next(err);
    }
    req.flash("success" ,"  Welcome to wanderlust");
res.redirect("/listings");
})

    }catch(e){
        req.flash("error" , e.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);

        }
        req.flash("success", "you are logged out");
        res.redirect("/login");

    });
}