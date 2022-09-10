const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 42,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
