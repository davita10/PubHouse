const express = require("express");
const router = express.Router();

const { create } = require("../controllers/category.controller");
const {
  requireSignin,
  isAuth,
  isAdmin,
} = require("../controllers/auth.controller");
const { userById } = require("../controllers/user.controller");

router.post(
  "/category/create/:userId",
  requireSignin,
  isAdmin,
  isAdmin,
  create
);

router.param("userId", userById);

module.exports = router;
