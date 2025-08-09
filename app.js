const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
//for parsing data in reuests
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
//to use static files like css for images
app.use(express.static(path.join(__dirname, "/public")));
//to use ejs-mate for boilerplates like nav bar or footers etc
app.engine("ejs", ejsMate);

const DB_URL = "mongodb://127.0.0.1:27017/wonderlust";

async function main() {
  await mongoose.connect(DB_URL);
}

main()
  .then(() => {
    console.log("connection OK");
  })
  .catch((err) => {
    console.log(err);
  });

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

//add new listing route
app.get("/listing/new", (req, res) => {
  res.render("./listings/new.ejs");
});

app.post("/listing", (req, res) => {
  const newlisting = new listing(req.body.listing);
  newlisting.save();
  res.redirect("/listing");
});

//edit route to serve form
app.get("/listing/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listingDetails = await listing.findById(id);
  res.render("./listings/edit.ejs", { listingDetails });
});

//update route to update in db and redirect to show details
app.put("/listing/:id", async (req, res) => {
  console.log("Holla");
  let { id } = req.params;
  await listing.findByIdAndUpdate(id, { ...req.body.listing });
  console.log(req.body.listing.image);
  res.redirect(`/listing/${id}`);
});

//delete route
app.delete("/listing/:id", async (req, res) => {
  let { id } = req.params;
  let deletedListing = await listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listing");
});

//Show details Route
app.get("/listing/:id", async (req, res) => {
  let { id } = req.params;
  const listingDetails = await listing.findById(id);
  res.render("./listings/show.ejs", { listingDetails });
});

app.listen("8080", () => {
  console.log("App is Listening at 8080.");
});
