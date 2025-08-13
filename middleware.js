module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;//to redirect the user to the path we was accessing before login
    req.flash("error", "You must be logged in for create listing!");
    return res.redirect("/login");
  }
  next();
};

//this middleware is for redirectng url to path it was accessing before login as after login passport removed all the seesion after login but in locals
module.exports.saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
  }
  next();
}