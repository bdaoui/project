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
router.get("/:restaurantId", (req, res) => {
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
        const isOwner = _id === restaurant.owner._id.toString() && req.session.hasOwnProperty('currentUser');
        const canBeChanged = _id === review.user._id.toString() && req.session.hasOwnProperty('currentUser');
        const isNotOwner = !isOwner;
        res.render('restaurant/restaurant-details', { restaurant, isNotOwner, isOwner, loggedInNavigation, canBeChanged })
    })
    .catch(err => console.error(err))
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
            return Restaurant.updateOne({name: restaurantUpdate.name, cuisine: restaurantUpdateInfo.cuisine})
      })
      .then(() => res.redirect('/restaurant/restaurants'))
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