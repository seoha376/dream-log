const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const { success, error } = require("../utils/response");

const register = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return error(res, 400, "MISSING_FIELDS", "All fields are required");
    }

    const existingUser = await User.findUserByEmail(email);
    if (existingUser) {
      return error(res, 409, "EMAIL_ALREADY_EXISTS", "Email already exists");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await User.createUser(email, passwordHash, username);

    return success(res, 201, {
      user_id: result.id,
      email,
      username
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

    // email 형식이면 email로 찾고, 아니면 username으로 찾기
    const isEmail = email.includes("@");
    const user = isEmail
      ? await User.findUserByEmail(email)
      : await User.findUserByUsername(email);

    if (!user) {
      return error(res, 401, "INVALID_CREDENTIALS", "Email or password is incorrect");
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return error(res, 401, "INVALID_CREDENTIALS", "Email or password is incorrect");
    }

    const token = jwt.sign(
      { user_id: user.user_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return success(res, 200, {
      token,
      user: {
        user_id: user.user_id,
        email: user.email,
        username: user.username
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