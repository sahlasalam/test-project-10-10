const mongoose = require("mongoose");

const connectDB = async () => {
  mongoose.connect("mongodb://localhost:27017/register_data", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

module.exports = connectDB;
