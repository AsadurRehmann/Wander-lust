const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner,validateListing } = require("../middleware.js");
const listingController=require("../controllers/listings.js");


router.route("/")
.get( wrapAsync(listingController.index))//listing Route
.post( validateListing, wrapAsync(listingController.createListing));//create new listing

//add new listing route
router.get("/new", isLoggedIn,listingController.renderNewForm);

router.route("/:id")
.get( wrapAsync(listingController.showListing))//Show details Route
.put(isLoggedIn,isOwner, validateListing, wrapAsync(listingController.updateListing))//update route to update in db and redirect to show details
.delete(isLoggedIn,isOwner, wrapAsync(listingController.deleteListing));//delete route

//edit route to serve form
router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync(listingController.editListing));


module.exports = router;