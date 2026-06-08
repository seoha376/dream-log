const db = require("../db/database");

exports.getDreams = async(req, res) => {

  try {
    const userId = req.user.user_id;
    const dreams = await Dream.findDreamsByUserId(userId);

    res.json(dreams);
  } catch (err) {
    console.error("GET DREAMS ERROR:", err.message);
    res.status(500).json({
      code: "GET_DREAMS_FAILED",
      message: "Failed to get dreams"
    });
  }
};


exports.getDream = async (req, res) => {
  const userId = req.user.user_id;
  const dreamId = req.params.id;

  try {
    const dream = await Dream.findDreamByIdAndUserId(dreamId, userId);

    if (!dream) {
      return res.status(404).json({
        code: "DREAM_NOT_FOUND",
        message: "Dream not found"
      });
    }
    
    res.json(dream);
  } catch (err) {
    console.error("GET DREAM ERROR:", err.message);
    res.status(500).json({
      code: "GET_DREAM_FAILED",
      message: "Failed to get dream"
    });
  }
};




exports.createDream = async (req, res) => {
  try {
  const userId = req.user.user_id;
  const { title, content, dream_date } = req.body;

  if (!title || !content || !dream_date) {
    return res.status(400).json({
      code: "MISSING_REQUIRED_FIELDS",
      message: "title, content, dream_date are required"
    });
  }

  const result = await Dream.createDream(userId, dream_date, title, content);

    res.status(201).json({
      dream_id: result.lastID,
      user_id: userId,
      title,
      content,
      dream_date,
    });
  } catch (err) {
    console.error("CREATE DREAM ERROR:", err.message);
    res.status(500).json({
      code: "CREATE_DREAM_FAILED",
      message: "Failed to create dream"
    });
  }
};




exports.updateDream = async (req, res) => {

  try {
    const userId = req.user.user_id;
    const dreamId = req.params.id;
    const { title, content, dream_date } = req.body;

    const existingDream = await Dream.findDreamByIdAndUserId(dreamId, userId);

    if (!existingDream) {
      return res.status(404).json({
        code: "DREAM_NOT_FOUND",
        message: "Dream not found"
      });
    }

    const nextTitle = title ?? existingDream.title;
    const nextContent = content ?? existingDream.content;
    const nextDate = dream_date ?? existingDream.dream_date;

    await Dream.updateDream(dreamId, userId, nextTitle, nextContent, nextDate);

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
    res.status(500).json({
      code: "UPDATE_DREAM_FAILED",
      message: "Failed to update dream"
    });
  }
};




exports.deleteDream = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const dreamId = req.params.id;

    const result = await Dream.deleteDream(dreamId, userId);

    if (result.changes === 0) {
      return res.status(404).json({
        code: "DREAM_NOT_FOUND",
        message: "Dream not found"
      });
    }

    res.json({
      message: "Dream deleted"
    });
  } catch (err) {
    console.error("DELETE DREAM ERROR:", err.message);
    res.status(500).json({
      code: "DELETE_DREAM_FAILED",
      message: "Failed to delete dream"
    });
  }
};

exports.toggleFavorite = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const dreamId = req.params.id;

    const dream = await Dream.findDreamByIdAndUserId(dreamId, userId);

    if (!dream) {
      return res.status(404).json({
        code: "DREAM_NOT_FOUND",
        message: "Dream not found"
      });
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
    res.status(500).json({
      code: "TOGGLE_FAVORITE_FAILED",
      message: "Failed to toggle favorite"
    });
  }
};