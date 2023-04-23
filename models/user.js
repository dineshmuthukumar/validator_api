const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true, trim: true, minLength: 3 },
  last_name: { type: String, required: true, trim: true, minLength: 3 },
  email: { type: String, unique: true, required: true, trim: true },
  mobile_number: { type: String, unique: true, required: true },
  password: { type: String, required: true, trim: true, minLength: 6 },

  country_code: { type: String },
  country: { type: String, ref: 'country' },
  state: { type: String, ref: 'state' },
  city: { type: String, ref: 'city' },
  user_status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
  device_type: { type: String },
  device_token: { type: String },
  device_id: { type: String },

  latitude: { type: String },
  longitude: { type: String },
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


module.exports = mongoose.model("user", userSchema);