const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minLength: 3 },
  email: { type: String, unique: true, required: true, trim: true },
  password: { type: String, required: true, trim: true, minLength: 6 },

  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },

  token: { type: String }
});

userSchema.methods.generateAuthToken = function (payload) {
  const token = jwt.sign(payload, process.env.TOKEN_KEY, {
    algorithm: "HS512",
    expiresIn: '1d',
  });
  return token;
}

userSchema.methods.generateRefreshToken = function (payload) {
  const token = jwt.sign(payload, process.env.REFRESH_TOKEN_KEY, {
    algorithm: "HS512",
    expiresIn: '1d',
  });
  return token;
}

module.exports = mongoose.model("admin", userSchema);