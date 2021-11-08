const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  //Get Token from the Header
  const token = req.header("X-auth-token");

  //check if not token
  if (!token) {
    return res.status(401).json({ msg: "no Token, authorization is Denied" });
  }

  //Verify Token
  try {
    const decode = jwt.verify(token, config.get("jwtSecret"));
    req.user = decode.user;
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Invalid Token in your id" });
  }
};
