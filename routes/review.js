const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview}=require("../middleware.js");
const Review = require("../models/review.js");
const listing = require("../models/listing.js");



//review post route
router.post("/", validateReview, wrapAsync(async (req, res) => {
    console.log("Router hits");
    let listingRev = await listing.findById(req.params.id);
    let newReview = new Review(req.body.reviews);

    listingRev.reviews.push(newReview);
    await newReview.save();
    await listingRev.save();
    let { id } = req.params;
    req.flash("success","New Review created");
    res.redirect(`/listing/${req.params.id}`)
}));

//delete review route
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listing/${id}`);
}));

module.exports = router;
