const { run, get, all } = require("../db/dbHelper");

const createDream = async (
  userId,
  dreamDate,
  title,
  content
) => {
  return await run(
    `
    INSERT INTO dreams
    (user_id,dream_date,title,content)
    VALUES (?,?,?,?)
    `,
    [userId, dreamDate, title, content]
  );
};

const findDreamsByUserId = async (userId) => {
  return await all(
    `
    SELECT *
    FROM dreams
    WHERE user_id=?
    ORDER BY dream_date DESC
    `,
    [userId]
  );
};

const findDreamByIdAndUserId = async (
  dreamId,
  userId
) => {
  return await get(
    `
    SELECT *
    FROM dreams
    WHERE dream_id=? AND user_id=?
    `,
    [dreamId, userId]
  );
};

module.exports = {
  createDream,
  findDreamsByUserId,
  findDreamByIdAndUserId
};