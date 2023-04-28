const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const providerSchema = new mongoose.Schema({
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
  driverStatus: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED', 'LOWBALANCE'], default: 'PENDING' },

  deviceType: { type: String },
  deviceToken: { type: String },
  deviceId: { type: String },

  taxiNumber: { type: String },
  taxiType: { type: String, enum: ['Sedan5', 'Sedan7', 'Van'] },
  wheelChair: { type: String, enum: ['YES', 'NO'] },
  pets: { type: String, enum: ['YES', 'NO'] },
  parcel: { type: String, enum: ['YES', 'NO'] },
  parcelType: { type: String, enum: ['SMALL', 'MEDIUM', 'LARGE'] },
  food: { type: String, enum: ['YES', 'NO'] },
  taxiImageFront: { type: String },
  taxiImageBack: { type: String },
  taxiImageIn: { type: String },
  driverLicense: { type: String },

  rating: { type: String },
  feedback: { type: String },
  invitationCode: { type: String },
  
  latitude: { type: String },
  longitude: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  
  token: { type: String }
});


providerSchema.methods.generateAuthToken = function (payload) {
  const token = jwt.sign(payload, process.env.TOKEN_KEY, {
    algorithm: "HS512",
    expiresIn: '1d',
  });
  return token;
}

providerSchema.methods.generateRefreshToken = function (payload) {
  const token = jwt.sign(payload, process.env.REFRESH_TOKEN_KEY, {
    algorithm: "HS512",
    expiresIn: '1d',
  });
  return token;
}

module.exports.Provider = mongoose.model("provider", providerSchema);