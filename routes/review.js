const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn, isReviewAuthor}=require("../middleware.js");
const Review = require("../models/review.js");
const listing = require("../models/listing.js");



//review post route
router.post("/",isLoggedIn, validateReview, wrapAsync(async (req, res) => {
    console.log("Router hits");
    let listingRev = await listing.findById(req.params.id);
    let newReview = new Review(req.body.reviews);
    newReview.author=req.user._id;//for adding author id along submitting review

    listingRev.reviews.push(newReview);
    await newReview.save();
    await listingRev.save();
    req.flash("success","New Review created");
    res.redirect(`/listing/${req.params.id}`)
}));

//delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listing/${id}`);
}));

module.exports = router;
