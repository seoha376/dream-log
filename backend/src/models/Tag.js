const { get, all } = require("../db/dbHelper");

const findAllTags = async () => {
  return await all(`
    SELECT *
    FROM tags
  `);
};

const findTagByName = async (name) => {
  return await get(
    `
    SELECT *
    FROM tags
    WHERE name=?
    `,
    [name]
  );
};

module.exports = {
  findAllTags,
  findTagByName
};