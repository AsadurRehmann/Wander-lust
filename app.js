if(process.env.NODE_ENV !="production"){
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError.js");
const cors = require("cors"); //for hopscotch
const session = require("express-session");
const MongoStore = require('connect-mongo');
const listingRoute = require("./routes/listing.js");
const reviewsRoute = require("./routes/review.js");
const userRoute = require("./routes/user.js");

const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//for parsing data in reqests
app.use(express.urlencoded({ extended: true }));
//for hopscotch
app.use(cors());
app.use(methodOverride("_method"));
//to use static files like css for images
app.use(express.static(path.join(__dirname, "/public")));
//to use ejs-mate for boilerplates like nav bar or footers etc
app.engine("ejs", ejsMate);

// const DB_URL = "mongodb://127.0.0.1:27017/wonderlust";
const dbUrl=process.env.ATLASDB_URL;

async function main() {
  await mongoose.connect(dbUrl);
}

main()
  .then(() => {
    console.log("connection OK");
  })
  .catch((err) => {
    console.log(err);
  });

const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,
});

store.on("error",()=>{
  console.log("ERROR IN MONGO SESSION",err);
});

//using sessions
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

// app.get("/", (req, res) => {
//   res.send("Hollaaa");
// });



//using seesion and flash
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//using flash for creating success and failure partials
app.use((req,res,next)=>{
res.locals.success=req.flash("success");
res.locals.error=req.flash("error");
res.locals.currUser=req.user;
next();//next will call the listing route
});

app.get('/', (req, res) => {
  res.redirect('/listing');
});

app.use("/listing", listingRoute);
app.use("/listing/:id/reviews", reviewsRoute);
app.use("/",userRoute);

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
