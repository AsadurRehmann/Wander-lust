const mongoose = require("mongoose");
const schema = mongoose.Schema;
const Review = require("./review.js")

const listingSchema = new schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: schema.Types.ObjectId,
    ref: "User"
  },
});

//for deleting the reviews of deleted listing
listingSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({ _id: { $in: doc.reviews } });
  }
});


const listing = mongoose.model("listing", listingSchema);
module.exports = listing;