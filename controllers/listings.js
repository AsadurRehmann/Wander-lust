const listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListings = await listing.find({});
    res.render("listings/index", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listingDetails = await listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!listingDetails) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listing");
    }
    res.render("listings/show", { listingDetails });
};

module.exports.createListing = async (req, res) => {
    const newlisting = new listing(req.body.listing);
    newlisting.owner = req.user._id;  //to add the owner property to new listing
    await newlisting.save();
    req.flash("success", "New listing created!");
    res.redirect("/listing");
}

module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const listingDetails = await listing.findById(id);
    if (!listingDetails) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listing");
    }
    res.render("listings/edit", { listingDetails });
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated");
    res.redirect(`/listing/${id}`);
}

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listing");
}