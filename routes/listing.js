const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const { listingSchema } = require("../schema.js");
const listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");

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
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new");
});

router.post("/", validateListing, wrapAsync(async (req, res) => {
  const newlisting = new listing(req.body.listing);
  newlisting.owner=req.user._id;  //to add the owner property to new listing
  await newlisting.save();
  req.flash("success", "New listing created!");
  res.redirect("/listing");
}));

//Show details Route
router.get("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listingDetails = await listing.findById(id).populate("reviews").populate("owner");
  if (!listingDetails) {
    req.flash("error", "Listing you requested does not exist!");
    return res.redirect("/listing");
  }
  res.render("listings/show", { listingDetails });
}));

//edit route to serve form
router.get("/:id/edit", isLoggedIn, wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listingDetails = await listing.findById(id);
  if (!listingDetails) {
    req.flash("error", "Listing you requested does not exist!");
    return res.redirect("/listing");
  }
  res.render("listings/edit", { listingDetails });
}));

//update route to update in db and redirect to show details
router.put("/:id", isLoggedIn, validateListing, wrapAsync(async (req, res) => {
  let { id } = req.params;
  await listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success", "Listing Updated");
  res.redirect(`/listing/${id}`);
}));

//delete route
router.delete("/:id", isLoggedIn, wrapAsync(async (req, res) => {
  let { id } = req.params;
  let deletedListing = await listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listing");
}));


module.exports = router;