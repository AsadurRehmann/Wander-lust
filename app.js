const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing.js");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const DB_URL = 'mongodb://127.0.0.1:27017/wonderlust';

async function main() {
    await mongoose.connect(DB_URL);
}

main().then(() => {
    console.log("connection OK");
}).catch((err) => {
    console.log(err);
})

app.get("/", (req, res) => {
    res.send("Hollaaa");
});

//testing models
// app.get("/test",async (req,res)=>{
//     let sampleListing= new listing({
//         title: "Mian Home",
//         description:"Sweet Home",
//         price:1000,
//         location:"Sahiwal",
//         country:"Pakistan"
//     });

//    await sampleListing.save();

//    console.log(sampleListing);
//    res.send("Success");
// });


//listing Route
app.get("/listing", async (req, res) => {
    const allListings = await listing.find({});

    res.render("./listings/index.ejs", { allListings });
});



app.listen("8080", () => {
    console.log("App is Listening at 8080.");
})