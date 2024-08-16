const Listing= require("./models/listing");
const ExpressError = require("./utils/ExpressError");


module.exports.isLoggedIn=(req,res,next)=>{
    console.log(req.user);
    if(!req.isAuthenticated()){
        req.flash("error" ," you must be logged in to  create a new listing !!")    
        return res.redirect("/login");
        }
    next();
};

module.exports.isOwner = async(req,res,next)=>{
    let {id}=req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error" , "You are not the owner of Listing. ");
        return res.redirect(`/listings/${id}`);
    }

 next();
}

module.exports.validatelisting = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
    }
