const jwt = require("jsonwebtoken");
const { error } = require("../utils/response");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return error(res, 401, "NO_TOKEN", "Authorization token is required");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      user_id: decoded.user_id,
      email: decoded.email
    };

    next();
  } catch (err) {
    return error(res, 401, "INVALID_TOKEN", "Invalid or expired token");
  }
};

module.exports = authMiddleware;