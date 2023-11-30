const jwt = require("jsonwebtoken");
const Manager = require("../model/manager");

exports.authenticateToken = (req, res, next) => {
  if (!req.headers["authorization"]) {
    return res.status(407).send({ message: "Authentication Required." });
  }
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, user) => {
      if (err) return res.status(401).send({ message: err.message });
      let existUser = await Manager.findById(user.id);
      if (!existUser)
        return res.status(401).send({ message: "Manager not found." });
      req.user = existUser;
      next();
    });
  } else next();
};
