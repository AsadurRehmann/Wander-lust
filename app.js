const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError.js");
const cors = require("cors"); //for hopscotch

const listingRoute=require("./routes/listing.js");
const reviewsRoute=require("./routes/review.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//for parsing data in reuests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//for hopscotch
app.use(cors());
app.use(methodOverride("_method"));
//to use static files like css for images
app.use(express.static(path.join(__dirname, "/public")));
//to use ejs-mate for boilerplates like nav bar or footers etc
app.engine("ejs", ejsMate);

const DB_URL = "mongodb://127.0.0.1:27017/wonderlust";

async function main() {
  await mongoose.connect(DB_URL);
}

main()
  .then(() => {
    console.log("connection OK");
  })
  .catch((err) => {
    console.log(err);
  });

// app.get("/", (req, res) => {
//   res.send("Hollaaa");
// });

app.use("/listing",listingRoute);
app.use("/listing/:id/reviews",reviewsRoute);

// catches errors with other routes that are in this code similar to app.all("*" res, next) => {
//     next(new expressError(404, "Page not found!"));
// });)
app.use((req, res, next) => {
  next(new expressError(404, "Page not found!"));
});

//custom Error handler
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong." } = err;
  console.error("Error in error handler:" + err);
  // res.status(statusCode).send(message);
  res.status(statusCode).render("listings/error", { message, statusCode });
  // console.log(message);
});

app.listen("8080", () => {
  console.log("App is Listening at 8080.");
});
