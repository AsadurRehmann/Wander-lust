const User = require("../models/user");


module.exports.renderSignupForm = (req, res) => {
    res.render("./user/signup");
}

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                next(err);
            }
            req.flash("success", "Welcome to Wanderlust");
            res.redirect("/listing");
        });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render("./user/login");
}

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to WanderLust!");
    let redirectUrl = res.locals.redirectUrl || "/listing"
    res.redirect(redirectUrl);
}

module.exports.logout= (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listing");
    });
}