const { run, get } = require("../db/dbHelper");

const createUser = async (
  email,
  passwordHash,
  nickname
) => {
  return await run(
    `
    INSERT INTO users
    (email,password_hash,nickname)
    VALUES (?,?,?)
    `,
    [email, passwordHash, nickname]
  );
};

const findUserByEmail = async (email) => {
  return await get(
    `
    SELECT *
    FROM users
    WHERE email=?
    `,
    [email]
  );
};

const findUserById = async (userId) => {
  return await get(
    `
    SELECT user_id,email,nickname,created_at
    FROM users
    WHERE user_id=?
    `,
    [userId]
  );
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById
};