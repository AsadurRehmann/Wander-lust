const mongoose = require("mongoose");
const initData = require("./data.js");
const listing = require("../models/listing.js");

const  DB_URL='mongodb://127.0.0.1:27017/wonderlust';

async function main(){
    await mongoose.connect(DB_URL);
}

main().then(()=>{
console.log("connection OK");
}).catch((err)=>{
    console.log(err);
});

const initDB = async ()=>{
    //for deletion of data before inserting sample data
    await listing.deleteMany({});
    console.log("Deleted");
    //initData is an object itself and to access its key ju ha (data) we need to access 
    await listing.insertMany(initData.data);
    console.log("Wagwan Data");
}

initDB();