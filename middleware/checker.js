const isLoggedIn = (req, res, next) => {
    if (req.session.currentUser) {
      next();
    }
    else {
      res.redirect("/auth/login");
    }
    
};

const isLoggedOut = (req, res, next) => {
    if (!req.session.currentUser) {
      next();
    }

    else {
      res.redirect("/");
    }
    
};

const isOwner = (req, res, next) => {
  if(!req.session.currentUser._id === req.params.restaurantId){
   res.redirect('/')
  }
  next()
};


  const canBeChanged = (req, res, next) => {
    if(!req.session.currentUser._id === req.params.reviewId){
      res.redirect("/res")
      }

      next()

}

  
  

module.exports = {
    isLoggedIn,
    isLoggedOut, 
    isOwner,
    canBeChanged
};