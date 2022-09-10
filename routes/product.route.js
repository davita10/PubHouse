const express = require("express");
const router = express.Router();

const { create } = require("../controllers/product.controller");
const {
  requireSignin,
  isAuth,
  isAdmin,
} = require("../controllers/auth.controller");
const { userById } = require("../controllers/user.controller");

router.post("/product/create/:userId", requireSignin, isAdmin, isAdmin, create);

router.param("userId", userById);
// router.param("productId", productById);

module.exports = router;
