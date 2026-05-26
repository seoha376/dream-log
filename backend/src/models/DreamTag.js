const { run, all } = require("../db/dbHelper");

const addTagToDream = async (
  dreamId,
  tagId
) => {
  return await run(
    `
    INSERT INTO dream_tags
    (dream_id,tag_id)
    VALUES (?,?)
    `,
    [dreamId, tagId]
  );
};

const findTagsByDreamId = async (
  dreamId
) => {
  return await all(
    `
    SELECT t.tag_id,t.name
    FROM tags t
    JOIN dream_tags dt
    ON t.tag_id=dt.tag_id
    WHERE dt.dream_id=?
    `,
    [dreamId]
  );
};

module.exports = {
  addTagToDream,
  findTagsByDreamId
};