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

const findTagById = async (tag_id) => {
  return await get(
    `
    SELECT *
    FROM tags
    WHERE tag_id = ?
    `,
    [tag_id]
  );
};

const addTagToDream = async (dream_id, tag_id) => {
  return await run(
    `
    INSERT OR IGNORE INTO dream_tags (dream_id, tag_id)
    VALUES (?, ?)
    `,
    [dream_id, tag_id]
  );
};

const removeTagsFromDream = async (dream_id) => {
  return await run(
    `
    DELETE FROM dream_tags
    WHERE dream_id = ?
    `,
    [dream_id]
  );
};

const findDreamsByUserIdAndKeyword = async (user_id, keyword) => {
  return await all(
    `
    SELECT *
    FROM dreams
    WHERE user_id = ?
      AND (title LIKE ? OR content LIKE ?)
    ORDER BY dream_date DESC
    `,
    [user_id, `%${keyword}%`, `%${keyword}%`]
  );
};

const findDreamsByUserIdAndTagId = async (user_id, tag_id) => {
  return await all(
    `
    SELECT d.*
    FROM dreams d
    JOIN dream_tags dt ON d.dream_id = dt.dream_id
    WHERE d.user_id = ? AND dt.tag_id = ?
    ORDER BY d.dream_date DESC
    `,
    [user_id, tag_id]
  );
};


module.exports = {
  createDream,
  findDreamsByUserId,
  findDreamByIdAndUserId,
  updateDream,
  deleteDream,
  updateFavorite,
  findTagById,
  addTagToDream,
  removeTagsFromDream,
  findDreamsByUserIdAndTagId,
  findDreamsByUserIdAndKeyword
};



