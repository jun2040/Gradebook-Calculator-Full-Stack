require('dotenv').config();
const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized" });
    }
    
    req.user = user;
    next();
  });
};
