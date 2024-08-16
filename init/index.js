const mongoose = require("mongoose");
const initData = require("./datafinal");
const Listing= require("../models/listing");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

async function main(){
    await mongoose.connect(MONGO_URL)
}

main().then(()=>{
    console.log("connected to data base")
}).catch((err)=>{
    console.log(err);

})

const initDB = async()=>{
   await  Listing.deleteMany({});
   initData.data = initData.data.map((obj)=> ({...obj, owner:"66ae3b8e4f6a1ceec20d4639"}));
   await Listing.insertMany(initData.data);
   
   console.log(" data was  initililized.");


}

initDB();