const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true, minLength: 3 },
  lastName: { type: String, required: true, trim: true, minLength: 3 },
  email: { type: String, unique: true, required: true, trim: true },
  mobileNumber: { type: String, unique: true, required: true },
  password: { type: String, required: true, trim: true, minLength: 6 },

  avatar: { type: String },
  countryCode: { type: String },
  country: { type: String, ref: 'country' },
  state: { type: String, ref: 'state' },
  city: { type: String, ref: 'city' },
  address: { type: String },
  zipcode: { type: String },
  status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },

  deviceType: { type: String },
  deviceToken: { type: String },
  deviceId: { type: String },
  
  rating: { type: String },
  feedback: { type: String },
  invitationCode: { type: String },

  latitude: { type: String },
  longitude: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

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


module.exports.User = mongoose.model("user", userSchema);