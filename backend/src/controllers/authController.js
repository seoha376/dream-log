const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const { success, error } = require("../utils/response");

const register = async (req, res) => {
  try {
    const { email, password, nickname } = req.body;

    if (!email || !password || !nickname) {
      return error(res, 400, "MISSING_FIELDS", "Email, password, and nickname are required");
    }

    const existingUser = await User.findUserByEmail(email);

    if (existingUser) {
      return error(res, 409, "EMAIL_ALREADY_EXISTS", "Email already exists");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await User.createUser(email, passwordHash, nickname);

    console.log("CREATE USER RESULT:", result);

    return success(res, 201, {
      user_id: result.id,
      email,
      nickname
    });
  } catch (err) {
    console.error(err);
    return error(res, 500, "REGISTER_FAILED", "Failed to register user");
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return error(res, 400, "MISSING_FIELDS", "Email and password are required");
    }

    const user = await User.findUserByEmail(email);

    if (!user) {
      return error(res, 401, "INVALID_CREDENTIALS", "Email or password is incorrect");
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return error(res, 401, "INVALID_CREDENTIALS", "Email or password is incorrect");
    }

    const token = jwt.sign(
      {
        user_id: user.user_id,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return success(res, 200, {
      token,
      user: {
        user_id: user.user_id,
        email: user.email,
        nickname: user.nickname
      }
    });
  } catch (err) {
    console.error(err);
    return error(res, 500, "LOGIN_FAILED", "Failed to login");
  }
};

module.exports = {
  register,
  login
};