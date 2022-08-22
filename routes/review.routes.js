const router = require("express").Router();
const Review = require('../models/Review.model');
const Restaurant = require('../models/Restaurant.model');
const {isOwner, isLoggedIn, isLoggedOut} = require("../middleware/checker");



router.post("/delete/:review/", isOwner, (req, res) => {
  const { reviewId } = req.params;
  Review.findByIdAndDelete(reviewId)
    .then(() => res.redirect('/restaurant/list'))
    .catch(err => console.error(err))
});



// /* CREATE NEW REVIEW  */

// router.get("/create/:restaurantId", (req, res) =>{
//   const {restaurantId} = req.params;
//   res.render("review/new-review", {restaurantId})
// })


router.post('/create/:restaurantId', async (req, res) => {
  const { comment } = req.body;
  const { restaurantId } = req.params;
  const restaurant = await Restaurant.findOne({_id: restaurantId}); // find restaurant in DB
  Review.create({ user: req.session.currentUser._id, comment})
  .then(async (newReview) => {
      await restaurant.reviews.push(newReview._id) // add review id to restaurant 'reviews' property
      await restaurant.save(); // save restaurant with new review id to the DB
  })
  .then(() => res.redirect(`/restaurant/${restaurantId}`))
  .catch(err => console.error(err))
})


/* EDIT REVIEW */

// router.get("/:reviewId/edit", (req, res) =>{
//   const {reviewId} = req.params;

//   Review.findById(reviewId)
//     .then(review =>{res.render("review/edit-review", {review})})
// })


// //edit a restaurant
// router.get("/:reviewId", isLoggedIn, (req, res) => {
//   const loggedInNavigation = true;
//   res.render('review/edit-review', {loggedInNavigation})
// });

// router.post("/edit/:reviewId", isOwner, (req, res) => {
//   const { reviewId } = req.params;
//   const reviewUpdate = req.body;

//     Review.findByIdAndUpdate(reviewId, reviewUpdate, {new: true})
//       .then(() => res.redirect(`/restaurant/${restaurantId}` ))
//       .catch(err => console.error(err))
// });





// /* GET All OWN REVIEWS */
// router.get("/own-reviews",  (req, res) => {
//   const user = req.session.currentUser._id;
//    Review.findOne({user: user})
//       .then(reviews =>{ res.render("review/own-reviews", {reviews});})
//       .catch(err => console.error(err))

//     });


  

//   /* GET SPECIFIC REVIEW*/

// router.get("/:id",  (req, res) =>{
//   const {id} = req.params;
//   console.log("hi")
//     Review.findById(id)
//         .then(review =>{ res.render("/review/review-details.hbs"), {review}})
//         .catch(err => console.error(err))

// })







// router.post("/reviewId/edit", (req, post)=>{
//   const {reviewId} = req.params;
//   const {comment, stars} = req.body;

//   Review.findByIdAndUpdate({reviewId}, {comment, stars}, {new: true})
//     .then(sendBack =>{res.render("review/own-review")})

// })

module.exports = router;