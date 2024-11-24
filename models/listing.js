const mongoose=require("mongoose");
const Schema= mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type:String,
        required :true,
    },
    description:{
        type:String,
        maxLength:200,
    },
    image: {  // Define image as an object with 'filename' and 'url'
        filename: {
          type: String,
        },
        url: {
          type: String,
        },
      },
    price:{
        type:Number,
        min:1,
    },
    location:{
        type:String,

    },
    country:{
        type:String,
    }
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;