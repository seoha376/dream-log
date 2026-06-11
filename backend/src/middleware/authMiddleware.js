const jwt = require("jsonwebtoken");
const { error } = require("../utils/response");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization; // 입력값(authorization header)

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return error(res, 401, "NO_TOKEN", "Authorization token is required");
  }

  const token = authHeader.split(" ")[1]; // 입력받은 헤더의 토큰으로

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // JWT 검증 in middleware

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