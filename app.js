const express= require("express");
const app= express();
const mongoose = require("mongoose");
const port=8080;
const Listing =require("./models/listing.js");
const path =require("path");
const methodOverride= require("method-override");
const ejsMate = require("ejs-mate");


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
// index route
app.get("/listings", async(req,res)=>{
   let allListings= await Listing.find({}) ;
   res.render("index.ejs",{allListings});
    
    });
    //  new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});
// show route
app.get("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
});
// create route
app.post("/listings",async(req,res)=>{
    const newListing=new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});
// edit route
app.get("/listings/:id/edit",async(req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
});
// update route
app.put("/listings/:id",async(req,res)=>{
    let {id} =req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});

    res.redirect("/listings");
 });
//  delete route
app.delete("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
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

app.listen(port,()=>{
    console.log(`app is listening on the port ${port}`);
});

