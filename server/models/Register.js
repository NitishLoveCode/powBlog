const mongoose = require("mongoose");
const validator = require("validator");

const register = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    trim: true,
    lowercase: true,
  },
  email: {
    type: String,
    trim: true,
    require: true,
    lowercase: true,
    validate: {
      validator: validator.isEmail,
      message: "{VALUE} is not a valid email",
      isAsync: false,
    },
  },
  password: {
    type: String,
    require: true,
    trim: true,
  },
  EmailVerification: {
    type: Boolean,
    default: false,
  }
});
const register_schema = new mongoose.model("NewUser", register);
module.exports = register_schema;
