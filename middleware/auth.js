const jwt = require("jsonwebtoken");
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const config = process.env;

const user = (req, res, next) => {

  let token = req.header("Authorization");
  if (token && token.startsWith('Bearer ')) {
      // Remove Bearer from string
      token = token.slice(7, token.length);
  }
  if (!token) return res.status(401).json({ msg: 'Access Denied' });

  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

function uploadAs(destinationPath) {

  if (!fs.existsSync(destinationPath)) {
    fs.mkdirSync(destinationPath, { recursive: true });
  }

  let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, destinationPath);
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
    }
  });

  let uploaded = multer({ storage: storage });
  return uploaded;
}

module.exports = {
  user: user,
  uploadAs: uploadAs
};
