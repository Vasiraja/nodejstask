// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  mobileNumber: String,
  emailVerified: { type: Boolean, default: false },
  profileImage: String
});
 
module.exports = mongoose.model('User', userSchema);
