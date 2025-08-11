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
    type: String,
    default: "https://images.unsplash.com/photo-1743093032165-085be78f7278?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    set: (v) =>
      v === "" ? "https://images.unsplash.com/photo-1743093032165-085be78f7278?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v

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
});

//for deleting the reviews of deleted listing
listingSchema.post("findOneAndDelete", async function (doc) {
  console.log("YOOOOOOOOO");
  if (doc) {
    await Review.deleteMany({ _id: { $in: doc.reviews } });
  }
});


const listing = mongoose.model("listing", listingSchema);
module.exports = listing;