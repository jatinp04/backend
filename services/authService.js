const jwt = require("jsonwebtoken");
// const secretKey = process.env.JWT_SECRET

module.exports = (req, res, next) => {
  var token = (req.cookies && req.cookies.authToken) || false;
  console.log(token);
  if (!token) {
    res.status(403).send("Invalid Token");
  }

  jwt.verify(token, process.env.JWT_SECRET, function (err, results) {
    if (err) {
      console.log(err);
      return res.status(401).send("Unauthorized");
    }
    next();
  });
};
