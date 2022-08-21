const bcrypt = require('bcrypt');
const saltRounds = 10;
const router = require("express").Router();
const User = require('../models/User.model');
const { isLoggedIn, isOwner } = require('../middleware/checker');


//sign up 
router.get("/signup", (req, res) => {
  const loggedInNavigation = false;
  res.render("auth/signup", {loggedInNavigation});
});

router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
 
  bcrypt
    .genSalt(saltRounds)
    .then(salt => bcrypt.hash(password, salt))
    .then(passwordHash => {
      return User.create({
        name,
        email,
        password: passwordHash,
      });
    })
    .then( () => {
      res.redirect('/auth/login');
    })
    .catch(error => console.log(error));  
})

//get profile
router.get("/profile", (req, res) => {
  const { name } = req.session.currentUser;
  const loggedInNavigation = true;
  res.render("auth/profile", {name, loggedInNavigation});
});


//login
router.get("/login", (req, res) => {
  const loggedInNavigation = false;
  res.render("auth/login", {loggedInNavigation});
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
 if (email === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter both, email and password to login.'
    });
    return;
  }
  User.findOne({ email })
      .then(user => {
        if (!user) {
          res.render('auth/login', { errorMessage: 'Email is not registered. Try with other email.' });   
          return;
        } else if (bcrypt.compareSync(password, user.password)) {  
          req.session.currentUser = user;
          res.redirect("/auth/profile");
        } else {
          res.render('auth/login', { errorMessage: 'Incorrect password.' }); 
        }
      })
      .catch(err => console.log(err))
})

//logout 
router.post('/logout', (req, res) => {
  res.clearCookie('connect.sid');
  req.session.destroy(()=>{
    res.redirect('/auth/login')
  })
})

module.exports = router;