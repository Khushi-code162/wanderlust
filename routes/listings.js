const express = require ("express");
const router = express.Router();
const wrapAsync= require("../utils/wrapAsync");
const {listingSchema,reviewSchema}=require("../schema.js");
const Review =require("../models/review.js");
const users = require("../routes/listings.js");
const Listing =require("../models/listing.js");
const flash = require("connect-flash");


const validateListing = (req,res,next)=>{
    let {error}= listingSchema.validate(req.body);
    if(error){
        let {errMsg}=error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
   }
    else{
        next();
    };
}

// index route
router.get("/", wrapAsync(async(req,res)=>{
    let allListings= await Listing.find({}) ;
    res.render("index.ejs",{allListings});
     
     }));
     //  new route
 router.get("/new",wrapAsync((req,res)=>{
     res.render("listings/new.ejs");
 }));
 // show route
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
})
);
// create route

router.post("/",wrapAsync(async(req,res,next)=>{
    const newListing=new Listing(req.body.listing);
    await newListing.save();
    req.flash("success","new listing created");
    res.redirect("/listings");

})
);
// edit route
router.get("/:id/edit",wrapAsync(async(req,res)=>{
    if(!req.body.listings){
        throw new ExpressError(400,"send valid data for listings");
    }
    let{id}=req.params;
    const listing=await Listing.findById(id);
    req.flash("success","listing edited");
    res.render("listings/edit.ejs",{listing});
})
);
// update route
router.put("/:id",wrapAsync(async(req,res)=>{
    if(!req.body.listings){
        throw new ExpressError(400,"send valid data for listings");
    }
    let {id} =req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success"," listing updated");
    res.redirect("/listings");
 })
);
//  delete route
router.delete("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","listing deleted");
    res.redirect("/listings");
})
);

module.exports = router;