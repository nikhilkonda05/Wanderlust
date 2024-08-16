const Listing=require("../models/listing");
const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeoCoding({ accessToken: mapToken });

module.exports.index=async(req,res,next)=>{
    
    let allListings= await Listing.find({})
       res.render("listings/index.ejs",{allListings})
    };


module.exports.renderNewForm =(req,res)=>{
    
    res.render("listings/new.ejs");
};

module.exports.createListing =async(req,res,next)=>{

    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit:1
    })
    .send();
    let url=req.file.path;
    let filename=req.file.filename;
    let newlisting = new Listing(req.body.listing);
    newlisting.owner=req.user._id;
    newlisting.image={url,filename};
    newlisting.geometry=response.body.features[0].geometry
    let savedListing= await newlisting.save();
    console.log(savedListing);
    req.flash("success" ," new listing created !!")
    res.redirect("/listings");};

module.exports.showListing=async(req,res,next)=>{
    let {id}= req.params;
    const listing =await Listing.findById(id).populate("owner");
    // console.log("id fetched.");
    res.render("listings/show.ejs" ,{listing});

};

module.exports.updateListing=async(req,res,next)=>{
    
    console.log("inside update route");
    let {id}= req.params;
    
   let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing}); 
   if(typeof req.file !== "undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
   }
    req.flash("success" ,"  listing updated successfully !!")
    res.redirect(`/listings/${id}`);
    
};

module.exports.editListing=async(req,res,next)=>{
    console.log("inside edit route");
    let {id}= req.params;
    const listing =await Listing.findById(id);
    if(!listing){
        req.flash("error" , "Listing you requested does not exist");
        res.render("/listings");
    }
    
    let orginalImageUrl=listing.image.url;
    orginalImageUrl=orginalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs" ,{listing , orginalImageUrl});
};

module.exports.deleteListing =async(req,res)=>{
    console.log("inside delete route");
    let {id}= req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success" ,"  listing Deleted successfully !!")
    res.redirect("/listings");
    
};