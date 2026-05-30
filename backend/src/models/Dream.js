const { run, get, all } = require("../db/dbHelper");

const createDream = async (
  user_id,
  dream_date,
  title,
  content
) => {
  return await run(
    `
    INSERT INTO dreams
    (user_id,dream_date,title,content)
    VALUES (?,?,?,?)
    `,
    [user_id, dream_date, title, content]
  );
};

const findDreamsByUserId = async (user_id) => {
  return await all(
    `
    SELECT *
    FROM dreams
    WHERE user_id=?
    ORDER BY dream_date DESC
    `,
    [user_id]
  );
};

const findDreamByIdAndUserId = async (
  dream_id,
  user_id
) => {
  return await get(
    `
    SELECT *
    FROM dreams
    WHERE dream_id=? AND user_id=?
    `,
    [dream_id, user_id]
  );
};

module.exports = {
  createDream,
  findDreamsByUserId,
  findDreamByIdAndUserId
};