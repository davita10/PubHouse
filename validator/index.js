exports.userSignupValidator = (req, res, next) => {
  // methods from express validator
  req.check("name", "Name is required").notEmpty();
  req
    .check("email", "Email must be between 4 to 42 characters")
    .matches(/.+\@.+\..+/) //must be email structure
    .withMessage("Email must contain valid @ structure")
    .isLength({
      min: 4,
      max: 42,
    });
  // passwords val
  req.check("password", "Password is required").notEmpty();
  req
    .check("password")
    .isLength({ min: 7 })
    .withMessage("Password must be at least 7 characters")
    .matches(/\d/) //at least one digit
    .withMessage("Password must contain a number");
  // grab errors with method and map through
  const errors = req.validationErrors();
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }
  // executed from export. callback to continue middleware for val map thru
  next();
};
