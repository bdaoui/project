const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "Must include name"]
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "Must include email"],
    index: true,
  },
  password: {
    type: String,
    required: [true, "Must include password"]
  },
  img: {
    type: String,
  }},
  {minimize: false});

const User = model('User', UserSchema);

module.exports = User
