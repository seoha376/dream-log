const { run, get, all } = require("../db/dbHelper");

const createDream = async (user_id,dream_date,title,content) => {
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

const findDreamByIdAndUserId = async (dream_id,user_id) => {
  return await get(
    `
    SELECT *
    FROM dreams
    WHERE dream_id=? AND user_id=?
    `,
    [dream_id, user_id]
  );
};

const updateDream = async (dream_id, user_id, title, content, dream_date) => {
  return await run(
    `
    UPDATE dreams
    SET title = ?, content = ?, dream_date = ?
    WHERE dream_id = ? AND user_id = ?
    `,
    [title, content, dream_date, dream_id, user_id]
  );
};

const deleteDream = async (dream_id, user_id) => {
  return await run(
    `
    DELETE FROM dreams
    WHERE dream_id = ? AND user_id = ?
    `,
    [dream_id, user_id]
  );
};


const updateFavorite = async (dream_id, user_id, is_favorite) => {
  return await run(
    `
    UPDATE dreams
    SET is_favorite = ?, updated_at = CURRENT_TIMESTAMP
    WHERE dream_id = ? AND user_id = ?
    `,
    [is_favorite, dream_id, user_id]
  );
};

module.exports = {
  createDream,
  findDreamsByUserId,
  findDreamByIdAndUserId,
  updateDream,
  deleteDream
};