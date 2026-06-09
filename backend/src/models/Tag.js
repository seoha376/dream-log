const { get, all } = require("../db/dbHelper");

const findAllTags = async () => {
  return await all(`
    SELECT *
    FROM tags
  `);
};

module.exports = {
  findAllTags
};