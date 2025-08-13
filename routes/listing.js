const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const listing = require("../models/listing.js");
const { isLoggedIn, isOwner,validateListing } = require("../middleware.js");


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
  newlisting.owner = req.user._id;  //to add the owner property to new listing
  await newlisting.save();
  req.flash("success", "New listing created!");
  res.redirect("/listing");
}));

//Show details Route
router.get("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listingDetails = await listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
  console.log(listingDetails.author);
  if (!listingDetails) {
    req.flash("error", "Listing you requested does not exist!");
    return res.redirect("/listing");
  }
  res.render("listings/show", { listingDetails });
}));

//edit route to serve form
router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listingDetails = await listing.findById(id);
  if (!listingDetails) {
    req.flash("error", "Listing you requested does not exist!");
    return res.redirect("/listing");
  }
  res.render("listings/edit", { listingDetails });
}));

//update route to update in db and redirect to show details
router.put("/:id", isLoggedIn,isOwner, validateListing, wrapAsync(async (req, res) => {
  let { id } = req.params;
  await listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success", "Listing Updated");
  res.redirect(`/listing/${id}`);
}));

//delete route
router.delete("/:id", isLoggedIn,isOwner, wrapAsync(async (req, res) => {
  let { id } = req.params;
  let deletedListing = await listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listing");
}));


module.exports = router;