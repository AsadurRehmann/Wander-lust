const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const expressError = require("./utils/expressError.js");
const cors = require("cors"); //for hopscotch
const Joi = require("joi"); //for server side schema validation
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));



//for parsing data in reuests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//for hopscotch
app.use(cors());
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

//for validate listing with Joi schema
const validateListing = (req, res, next) => {

  //check if body exist
  if (!req.body) {
    return next(new expressError(400, "Request body is required."));
  }

  //check for empty listing object
  if (!req.body.listing) {
    return next(new expressError(400, "Listing data is required."));
  }

  const { error } = listingSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new expressError(400, errMsg);
  } else {
    next();
  }
};

//for validate review with Joi schema
const validateReview = (req, res, next) => {
  //check if body exist
  if (!req.body) {
    return next(new expressError(400, "Request body is required."));
  }

  const { error } = reviewSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new expressError(400, errMsg);
  } else {
    next();
  }
};


app.get("/", (req, res) => {
  res.send("Hollaaa");
});

//listing Route
app.get("/listing", wrapAsync(async (req, res) => {
  const allListings = await listing.find({});
  res.render("listings/index", { allListings });
}));

//add new listing route
app.get("/listing/new", (req, res) => {
  res.render("listings/new");
});

app.post("/listing", validateListing, wrapAsync(async (req, res) => {
  const newlisting = new listing(req.body.listing);
  await newlisting.save();
  res.redirect("/listing");
}));

//edit route to serve form
app.get("/listing/:id/edit", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listingDetails = await listing.findById(id);
  res.render("listings/edit", { listingDetails });
}));

//update route to update in db and redirect to show details
app.put("/listing/:id", validateListing, wrapAsync(async (req, res) => {
  let { id } = req.params;
  await listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listing/${id}`);
}));

//delete route
app.delete("/listing/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let deletedListing = await listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listing");
}));

//review post route
app.post("/listing/:id/reviews", validateReview, wrapAsync(async (req, res) => {

  let listingRev = await listing.findById(req.params.id);
  let newReview = new Review(req.body.reviews);

  listingRev.reviews.push(newReview);
  await newReview.save();
  await listingRev.save();

  res.redirect(`/listing/${req.params.id}`)
}));

//Show details Route
app.get("/listing/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listingDetails = await listing.findById(id).populate("reviews");
  res.render("listings/show", { listingDetails });
}));

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

// catches errors with other routes that are in this code similar to app.all("*" res, next) => {
//     next(new expressError(404, "Page not found!"));
// });)
app.use((req, res, next) => {
  next(new expressError(404, "Page not found!"));
});

//custom Error handler
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong." } = err;
  console.error("Error in error handler:" + err);
  // res.status(statusCode).send(message);

  res.status(statusCode).render("listings/error", { message, statusCode });
  // console.log(message);
});

app.listen("8080", () => {
  console.log("App is Listening at 8080.");
});
