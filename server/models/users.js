// const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const users = new mongoose.Schema(
  {
    firstName: { type: String, index: true },
    lastName: { type: String, index: true },
    email: { type: String, index: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("users", users);
