const { run, get } = require("../db/dbHelper");

const createUser = async (
  email,
  passwordHash,
  username
) => {
  return await run(
    `
    INSERT INTO users
    (email,password_hash,nickname)
    VALUES (?,?,?)
    `,
    [email, passwordHash, username]
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

const findUserById = async (id) => {
  return await get(
    `
    SELECT user_id,email,username,created_at
    FROM users
    WHERE user_id=?
    `,
    [id]
  );
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById
};