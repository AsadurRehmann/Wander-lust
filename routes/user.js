const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/signup", (req, res) => {
    res.render("./user/signup");
});

router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                next(err);
            }
            req.flash("success", "Wolcome to Wanderlust");
            res.redirect("/listing");
        });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }

}));

router.get("/login", (req, res) => {
    res.render("./user/login");
});

//using passport to authenticate login
router.post("/login", saveRedirectUrl,
    passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
    async (req, res) => {
        req.flash("success", "Wolcome back to WanderLust!");
        let redirectUrl=res.locals.redirectUrl || "/listing"
        res.redirect(redirectUrl);
    });

router.get("/logout", (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listing");
    });
});

module.exports = router;