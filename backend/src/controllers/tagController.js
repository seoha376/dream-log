const Tag = require("../models/Tag");
const { success, error } = require("../utils/response");

const getTags = async (req, res) => {
  try {
    const tags = await Tag.findAllTags();

    return success(res, 200, tags);
  } catch (err) {
    console.error(err);

    return error(
      res,
      500,
      "GET_TAGS_FAILED",
      "Failed to fetch tags"
    );
  }
};

module.exports = {
  getTags,
};