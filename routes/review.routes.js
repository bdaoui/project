const router = require("express").Router();
const Review = require("../models/Review.model");
const User = require("../models/User.model");
const Restaurant = require("../models/Restaurant.model");
const { isLoggedIn, isLoggedOut, isOwner } = require("../middleware/checker");


// post a review on the restaurant page
router.post('/create/:restaurantId', async (req, res) => {
  const { comment, stars } = req.body;
  const { restaurantId } = req.params;
  const restaurant = await Restaurant.findOne({_id: restaurantId}); // find restaurant in DB
  Review.create({ user: req.session.currentUser._id, comment, stars})
  .then(async (newReview) => {
      await restaurant.reviews.push(newReview._id) // add review id to restaurant 'reviews' property
      await restaurant.save(); // save restaurant with new review id to the DB
  })
  .then(() => res.redirect(`/restaurant/${restaurantId}`))
  .catch(err => console.error(err))
})

//edit 
router.get("/edit/:reviewId", isLoggedIn, isOwner, (req, res) => {
  const { reviewId } = req.params;
  const loggedInNavigation = true;
  res.render('review/edit-review', { loggedInNavigation, reviewId })
});

router.post("/edit/:reviewId", isOwner, (req, res) => {
  const { reviewId } = req.params;
  const reviewUpdate = req.body;
    Review.findByIdAndUpdate(reviewId, reviewUpdate, {new: true})
      .then(() => {
        res.redirect('/restaurant/list');
      
      })
      .catch(err => console.error(err))

});

//delete
router.post("/delete/:reviewId", isOwner, (req, res) => {
  const { reviewId } = req.params;
  Review.findByIdAndDelete(reviewId)
    .then(() => res.redirect('/restaurant/list'))
    .catch(err => console.error(err))
});


module.exports = router;