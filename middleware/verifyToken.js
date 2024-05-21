const jwt = require("jsonwebtoken");
const User = require("../model/user");
const Permission = require("../model/permission");

exports.authenticateToken = (req, res, next) => {
  if (!req.headers["authorization"]) {
    return res.status(407).send({ message: "Authentication Required." });
  }
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, user) => {
      if (err)
        return res
          .status(401)
          .send({ message: err.message, data: { logout: true } });
      let existUser = await User.findById(user.id);
      if (!existUser)
        return res
          .status(401)
          .send({ message: "User not found.", data: { logout: true } });
      if (!existUser.isActive)
        return res.status(401).send({
          message:
            "Your account is deactivated. Please contact the admin for assistance.",
          data: { logout: true },
        });
      let permission = await Permission.findOne({ userId: user.id });
      if (permission.changed)
        return res.status(401).send({
          message: "Your session is expired. Please try to login.",
          data: { logout: true },
        });
      req.user = existUser;
      next();
    });
  } else next();
};

// Grant access to specific roles with admin / user / employee
exports.auth = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        res.status(403).json({
          message: `User role ${req.user.role} is not authorized to access this route`,
        })
      );
    }
    next();
  };
};
