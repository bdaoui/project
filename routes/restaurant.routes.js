const express = require("express");
const router = express.Router();
const { isLoggedIn, isOwner, canBeChanged } = require('../middleware/checker');
const Restaurant = require('../models/Restaurant.model');
const Review = require('../models/Review.model');

//get all restaurants
router.get("/list", (req, res) => {
  Restaurant.find()
    .populate("owner")
    .then(restaurants => {
      const loggedInNavigation = req.session.hasOwnProperty('currentUser');
      res.render('restaurant/restaurants', { restaurants, loggedInNavigation })
      })
    .catch(err => console.error(err))
});

//get own list
router.get("/own-list", isOwner, (req, res) => {
  const loggedInNavigation = req.session.hasOwnProperty('currentUser');
  Restaurant.find()
    .populate("owner")
    .then(restaurants => {
      const  _id = req.session?.currentUser?._id; 
      const ownRestaurants = restaurants.filter((e) => { 
        return e.owner._id.toString() === _id
      })
      res.render('restaurant/own-restaurants', { loggedInNavigation, ownRestaurants })
      })
    .catch(err => console.error(err))
});

//create a restaurant
router.get("/create", isLoggedIn, (req, res) => {
  const loggedInNavigation = true;
  res.render('restaurant/new-restaurant', {loggedInNavigation})
});

router.post("/create", isLoggedIn, (req, res) => {
  const { name, cuisine, imageUrl } = req.body;
  const { _id } = req.session.currentUser;
  Restaurant.create({ name, cuisine, imageUrl, owner:_id })
    .then(newRestaurant =>{
          res.redirect('/restaurant/list')
    })
    .catch(err => console.error(err))
});

//get single restaurant
router.get("/:restaurantId", isLoggedIn, (req, res) => {
  const  _id = req.session?.currentUser?._id; 
  const { restaurantId } = req.params;
  Restaurant.findById(restaurantId)
    .populate("owner reviews") 
    .populate({ 
      path: 'reviews',
      populate: {
        path: "user", 
        model: "User",
      }
    })
    .then(restaurant => {
      const loggedInNavigation = req.session.hasOwnProperty('currentUser');
      const restaurantCopy = restaurant
      const updatedReviews = restaurantCopy.reviews.map(review => {
        if(review.user._id.toString() === _id) {return {
          _id : review._id,
          user : review.user,
          comment : review.comment,
          stars : review.stars,
          canBeChanged: true,
        }}
        else{
          return review
        }
      })
      const isOwner = _id === restaurant.owner._id.toString() && req.session.hasOwnProperty('currentUser');
      const isNotOwner = !isOwner;
      res.render('restaurant/restaurant-details', { restaurant, updatedReviews, isNotOwner, isOwner, loggedInNavigation, canBeChanged})
    })
    .catch(err => console.log(err))
  });

//edit a restaurant
router.get("/edit/:restaurantId", isLoggedIn, (req, res) => {
  const loggedInNavigation = true;
  res.render('restaurant/edit-restaurant', {loggedInNavigation})
});

router.post("/edit/:restaurantId", isOwner, (req, res) => {
  const { restaurantId } = req.params;
  const restaurantUpdate = req.body;

  if(restaurantUpdate.imageUrl === ''){
    Restaurant.findById(restaurantId)
      .then(restaurants => {
            return Restaurant.updateOne({name: restaurantUpdate.name, cuisine: restaurantUpdate.cuisine})
      })
      .then(() => res.redirect('/restaurant/list'))
  } else 
  {
    Restaurant.findByIdAndUpdate(restaurantId, restaurantUpdate, {new: true})
      .then(() => {
        res.redirect('/restaurant/list');
      })
      .catch(err => console.error(err))
  }
});

//delete a restaurant
router.post("/delete/:restaurantId", isOwner, (req, res) => {
  const { restaurantId } = req.params;
  Restaurant.findByIdAndDelete(restaurantId)
    .then(() => res.redirect('/restaurant/list'))
    .catch(err => console.error(err))
});

module.exports = router;