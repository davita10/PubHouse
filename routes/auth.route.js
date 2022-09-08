const express = require("express");
const router = express.Router();

const {
  signup,
  signin,
  signout,
  requireSignin,
} = require("../controllers/auth.controller");
const { userSignupValidator } = require("../validator"); //index loads auto

router.post("/signup", userSignupValidator, signup);
// anytime req comes in signup this controller method will run validator then signup
router.post("/signin", signin);
router.get("/signout", signout);

// router.get("/hello", requireSignin, (req, res) => {
//   res.send("hello there");
// });              //NOT NEEDED AFTER TEST FOR ROUTE PROTECTION

module.exports = router;
