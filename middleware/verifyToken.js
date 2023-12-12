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

// Grant access to specific roles with admin / manager / employee
exports.auth = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        res
          .status(403)
          .json({
            message: `User role ${req.user.role} is not authorized to access this route`,
          })
      );
    }
    next();
  };
};
