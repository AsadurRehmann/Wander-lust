const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn, isReviewAuthor}=require("../middleware.js");
const reviewControler=require("../controllers/reviews.js");

//review post route
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewControler.createReview));

//delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewControler.delteReview));

module.exports = router;
