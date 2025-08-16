const listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

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
    let response = await geocodingClient
         .forwardGeocode({
            query: req.body.listing.location,
            limit: 1
        })
        .send()
    let url = req.file.path;
    let filename = req.file.filename;
    const newlisting = new listing(req.body.listing);
    newlisting.owner = req.user._id;  //to add the owner property to new listing
    newlisting.image = { url, filename };
    newlisting.geometry=response.body.features[0].geometry;//this value is coming from mapbox
    await newlisting.save();
    req.flash("success", "New listing created!");
    res.redirect("/listing");
}

module.exports.filterByCategory=async(req,res)=>{
    const category=req.params.category;
    const filteredListings =await listing.find({category});
    if (!filteredListings .length) {
        req.flash("error", `No listings found in ${category} category`);
        return res.redirect("/listing");
    }
    res.render("listings/index", { allListings: filteredListings  });
}

module.exports.searchListings = async (req, res) => {
  const { q } = req.query;

  if (!q) {
    req.flash("error", "Please enter a search term");
    return res.redirect("/listing");
  }
  const results = await listing.find(
    { $text: { $search: q } },
    { score: { $meta: "textScore" } }
  ).sort({ score: { $meta: "textScore" } });

  res.render("listings/index", { allListings: results });
};

module.exports.editListing = async (req, res) => {

    let { id } = req.params;
    const listingDetails = await listing.findById(id);
    if (!listingDetails) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listing");
    }

    let originalImageUrl = listingDetails.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/c_fill,h_200,w_200");
    console.log(originalImageUrl);
    res.render("listings/edit", { listingDetails, originalImageUrl });
}

module.exports.updateListing = async (req, res) => {

    let { id } = req.params;
    let updateListing = await listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        updateListing.image = { url, filename };
        updateListing.save();
    }
    req.flash("success", "Listing Updated");
    res.redirect(`/listing/${id}`);
}

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listing");
}