const express= require("express");
const app= express();
const mongoose = require("mongoose");
const port=8080;
const Listing =require("./models/listing.js");
const path =require("path");
const methodOverride= require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync= require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema}=require("./schema.js").default;

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));



main()
.then(()=>{
    console.log("connected to Db");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
app.get("/",(req,res)=>{
    res.send("hi ,i am root");
});
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
app.get("/listings", wrapAsync(async(req,res)=>{
   let allListings= await Listing.find({}) ;
   res.render("index.ejs",{allListings});
    
    }));
    //  new route
app.get("/listings/new",wrapAsync((req,res)=>{
    res.render("listings/new.ejs");
}));
// show route
app.get("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
})
);
// create route

app.post("/listings",wrapAsync(async(req,res,next)=>{
    const newListing=new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");

})
);
// edit route
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    if(!req.body.listings){
        throw new ExpressError(400,"send valid data for listings");
    }
    let{id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
})
);
// update route
app.put("/listings/:id",wrapAsync(async(req,res)=>{
    if(!req.body.listings){
        throw new ExpressError(400,"send valid data for listings");
    }
    let {id} =req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});

    res.redirect("/listings");
 })
);
//  delete route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
})
);
// post route
// review
app.post("/listings/:id/reviews",async(req,res)=>{
   let listing= await Listing.findById(req.params.id);
   let newReview =new Review(req.body.review);

listings.reviews.push(newReview);
await newReview.save();
await listing.save();

console.log("new review saved");
res.send("new review saved");
});




// app.get("/testlisting",async(req,res)=>{
//     let sampleListing =new Listing({
//         tittle:"My new villa",
//         description:"by beach",
//         price:1200,
//         lication:"calangute,Goa",
//         country:"India"

//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("sucessful testing");
// });

app.all("*",(req,res,next)=>{
    next(new ExpressError(404, "Page not found"));
})
// middle ware
app.use((err,req,res,next)=>{
let {statusCode=500,message="something went wrong"}=err;
res.status(statusCode).render("error.ejs",{message});
// res.status(statusCode).send(message);
});


app.listen(port,()=>{
    console.log(`app is listening on the port ${port}`);
});

