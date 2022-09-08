const mongoose = require("mongoose");
const crypto = require("crypto");
const { v1: uuidv1 } = require("uuid");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 42,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: 42,
    },
    hashed_password: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      trim: true,
    },
    salt: String,
    role: {
      type: Number,
      default: 0,
    },
    history: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

// virtual field - w mongo Schema
userSchema
  .virtual("password")
  .set(function (password) {
    // password from client side to temp psswrd
    this._password = password;
    this.salt = uuidv1();
    // gives us random string w salt hashed pw
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

// add methods to userSchema
userSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },
  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
      // from node.js docs crypto
    } catch (err) {
      return "";
    }
  },
};
module.exports = mongoose.model("User", userSchema);
