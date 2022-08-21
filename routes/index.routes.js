const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  const loggedInNavigation = false;
  res.render("index", { loggedInNavigation });
});

module.exports = router;
