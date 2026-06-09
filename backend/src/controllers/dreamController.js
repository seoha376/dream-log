const Dream = require("../models/Dream");
const DreamTag = require("../models/DreamTag");
const aiService = require("../services/aiService");

exports.getDreams = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { tag, keyword } = req.query;

    let dreams;
    if (tag) {
      dreams = await Dream.findDreamsByUserIdAndTagId(userId, tag);
    } else if (keyword) {
      dreams = await Dream.findDreamsByUserIdAndKeyword(userId, keyword);
    } else {
      dreams = await Dream.findDreamsByUserId(userId);
    }

    const dreamsWithTags = await Promise.all(
      dreams.map(async (dream) => {
        const tags = await DreamTag.findTagsByDreamId(dream.dream_id);
        return { ...dream, tags: tags.map((t) => t.tag_id) };
      })
    );

    res.json(dreamsWithTags);
  } catch (err) {
    console.error("GET DREAMS ERROR:", err.message);
    res.status(500).json({ code: "GET_DREAMS_FAILED", message: "Failed to get dreams" });
  }
};

exports.getDream = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const dreamId = req.params.id;

    const dream = await Dream.findDreamByIdAndUserId(dreamId, userId);
    if (!dream) {
      return res.status(404).json({ code: "DREAM_NOT_FOUND", message: "Dream not found" });
    }

    const tags = await DreamTag.findTagsByDreamId(dreamId);
    res.json({ ...dream, tags: tags.map((t) => t.tag_id) });
  } catch (err) {
    console.error("GET DREAM ERROR:", err.message);
    res.status(500).json({ code: "GET_DREAM_FAILED", message: "Failed to get dream" });
  }
};

exports.createDream = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { title, content, dream_date, tags = [] } = req.body;

    if (!title || !content || !dream_date) {
      return res.status(400).json({
        code: "MISSING_REQUIRED_FIELDS",
        message: "title, content, dream_date are required"
      });
    }

    if (!Array.isArray(tags)) {
      return res.status(400).json({
        code: "INVALID_TAGS",
        message: "tags must be an array"
      });
    }

    const result = await Dream.createDream(userId, dream_date, title, content);
    const dreamId = result.id;

    for (const tagId of tags) {
      const tag = await Dream.findTagById(tagId);
      if (!tag) {
        return res.status(400).json({
          code: "INVALID_TAG_ID",
          message: `Invalid tag_id: ${tagId}`
        });
      }
      await Dream.addTagToDream(dreamId, tagId);
    }

    res.status(201).json({
      dream_id: dreamId,
      user_id: userId,
      title,
      content,
      dream_date,
      tags
    });
  } catch (err) {
    console.error("CREATE DREAM ERROR:", err.message);
    res.status(500).json({ code: "CREATE_DREAM_FAILED", message: "Failed to create dream" });
  }
};

exports.updateDream = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const dreamId = req.params.id;
    const { title, content, dream_date, tags } = req.body;

    const existingDream = await Dream.findDreamByIdAndUserId(dreamId, userId);
    if (!existingDream) {
      return res.status(404).json({ code: "DREAM_NOT_FOUND", message: "Dream not found" });
    }

    const nextTitle = title ?? existingDream.title;
    const nextContent = content ?? existingDream.content;
    const nextDate = dream_date ?? existingDream.dream_date;

    await Dream.updateDream(dreamId, userId, nextTitle, nextContent, nextDate);

    if (Array.isArray(tags)) {
      await Dream.removeTagsFromDream(dreamId);
      for (const tagId of tags) {
        const tag = await Dream.findTagById(tagId);
        if (!tag) {
          return res.status(400).json({
            code: "INVALID_TAG_ID",
            message: `Invalid tag_id: ${tagId}`
          });
        }
        await Dream.addTagToDream(dreamId, tagId);
      }
    }

    res.json({
      dream_id: Number(dreamId),
      user_id: userId,
      title: nextTitle,
      content: nextContent,
      dream_date: nextDate,
      is_favorite: existingDream.is_favorite
    });
  } catch (err) {
    console.error("UPDATE DREAM ERROR:", err.message);
    res.status(500).json({ code: "UPDATE_DREAM_FAILED", message: "Failed to update dream" });
  }
};

exports.deleteDream = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const dreamId = req.params.id;

    const result = await Dream.deleteDream(dreamId, userId);
    if (result.changes === 0) {
      return res.status(404).json({ code: "DREAM_NOT_FOUND", message: "Dream not found" });
    }

    res.json({ message: "Dream deleted" });
  } catch (err) {
    console.error("DELETE DREAM ERROR:", err.message);
    res.status(500).json({ code: "DELETE_DREAM_FAILED", message: "Failed to delete dream" });
  }
};

exports.toggleFavorite = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const dreamId = req.params.id;

    const dream = await Dream.findDreamByIdAndUserId(dreamId, userId);
    if (!dream) {
      return res.status(404).json({ code: "DREAM_NOT_FOUND", message: "Dream not found" });
    }

    const nextFavorite = dream.is_favorite ? 0 : 1;
    await Dream.updateFavorite(dreamId, userId, nextFavorite);

    res.json({
      dream_id: Number(dreamId),
      user_id: Number(userId),
      is_favorite: nextFavorite
    });
  } catch (err) {
    console.error("TOGGLE FAVORITE ERROR:", err.message);
    res.status(500).json({ code: "TOGGLE_FAVORITE_FAILED", message: "Failed to toggle favorite" });
  }
};

exports.summarizeDream = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const dreamId = req.params.id;

    const dream = await Dream.findDreamByIdAndUserId(dreamId, userId);
    if (!dream) {
      return res.status(404).json({ code: "DREAM_NOT_FOUND", message: "Dream not found" });
    }

    const summary = await aiService.generateDreamSummary(dream.content);
    await Dream.updateDreamSummary(dreamId, userId, summary);

    return res.status(200).json({
      dream_id: Number(dreamId),
      ai_summary: summary
    });
  } catch (err) {
    console.error("SUMMARIZE DREAM ERROR:", err.message);
    return res.status(500).json({ code: "SUMMARY_FAILED", message: "Failed to summarize dream" });
  }
};