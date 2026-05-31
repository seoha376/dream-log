const { run, all } = require("../db/dbHelper");

const addTagToDream = async (
  dream_id,
  tag_id
) => {
  return await run(
    `
    INSERT INTO dream_tags
    (dream_id,tag_id)
    VALUES (?,?)
    `,
    [dream_id, tag_id]
  );
};

const findTagsByDreamId = async (
  dream_id
) => {
  return await all(
    `
    SELECT t.tag_id,t.name
    FROM tags t
    JOIN dream_tags dt
    ON t.tag_id=dt.tag_id
    WHERE dt.dream_id=?
    `,
    [dream_id]
  );
};

module.exports = {
  addTagToDream,
  findTagsByDreamId
};