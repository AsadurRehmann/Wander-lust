const listing = require("./models/listing");
const expressError = require("./utils/expressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");


module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;//to redirect the user to the path we was accessing before login
    req.flash("error", "You must be logged in for create listing!");
    return res.redirect("/login");
  }
  next();
};

//this middleware is for redirectng url to path it was accessing before login as after login passport removed all the seesion after login but in locals
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listingId = await listing.findById(id);
  if (!listingId.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the owner of this listing!");
    return res.redirect(`/listing/${id}`);
  }
  next();
}

//for validate listing with Joi schema
module.exports.validateListing = (req, res, next) => {
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
module.exports.validateReview = (req, res, next) => {
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