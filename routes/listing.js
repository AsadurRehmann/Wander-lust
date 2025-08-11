const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const { listingSchema } = require("../schema.js");
const listing = require("../models/listing.js");

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


//listing Route
router.get("/", wrapAsync(async (req, res) => {
  const allListings = await listing.find({});
  res.render("listings/index", { allListings });
}));

//add new listing route
router.get("/new", (req, res) => {
  res.render("listings/new");
});

router.post("/", validateListing, wrapAsync(async (req, res) => {
  const newlisting = new listing(req.body.listing);
  await newlisting.save();
  res.redirect("/listing");
}));

//Show details Route
router.get("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listingDetails = await listing.findById(id).populate("reviews");
  res.render("listings/show", { listingDetails });
}));

//edit route to serve form
router.get("/:id/edit", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listingDetails = await listing.findById(id);
  res.render("listings/edit", { listingDetails });
}));

//update route to update in db and redirect to show details
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
  let { id } = req.params;
  await listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listing/${id}`);
}));

//delete route
router.delete("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let deletedListing = await listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listing");
}));

module.exports = router;