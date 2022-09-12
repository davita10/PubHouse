const User = require("../models/user.model");

exports.userById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }
    req.profile = user;
    next(); //because this is MIDDLEWARE we have to use execute next for application to continue
  });
};

exports.read = (req, res) => {
  //userId in route param auto runs method and makes user avail thru req.profile
  req.profile.hashed_password = undefined; //to be sure we do not send hash or salt
  req.profile.salt = undefined; //to be sure we do not send hash or salt
  return res.json(req.profile);
};

exports.update = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.profile._id }, //we find user and set whatever new update from request body, new true allows new data res.json sent front as json response
    { $set: req.body },
    { new: true },
    (err, user) => {
      if (err) {
        return res.status(400).json({
          error: "You are not authorized to perform this action",
        });
      }
      user.hashed_password = undefined; //to be sure we do not send hash or salt
      user.salt = undefined; //to be sure we do not send hash or salt
      res.json(user);
    }
  );
};
