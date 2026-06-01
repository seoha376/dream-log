const db = require("../db/database");

exports.getDreams = (req, res) => {

  const userId = req.user.user_id;

  db.all(
    "SELECT * FROM dreams WHERE user_id = ? ORDER BY dream_date DESC, dream_id DESC",
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    }
  );
};


exports.getDream = (req, res) => {
  const userId = req.user.user_id;
  const dreamId = req.params.id;

  db.get(
    "SELECT * FROM dreams WHERE dream_id = ? AND user_id = ?",
    [dreamId, userId],
    (err, row) => {
      if (err) return res.status(500).json(err);
      if (!row) return res.status(404).json({ message: "Dream not found" });

      res.json(row);
    }
  );
};




exports.createDream = (req, res) => {
  const userId = req.user.user_id;
  const { title, content, dream_date } = req.body;

  if (!title || !content || !dream_date) {
    return res.status(400).json({ message: "title, content, dream_date are required" });
  }

  db.run(
    `
    INSERT INTO dreams (user_id, title, content, dream_date)
    VALUES (?, ?, ?, ?)
    `,
    [userId, title, content, dream_date],
    function (err) {
      if (err) {
        console.error("CREATE DREAM ERROR:", err.message);
        return res.status(500).json({
          message: err.message,
          code: err.code,
        });
      }
        
        
        
        // return res.status(500).json(err);

      res.status(201).json({
        dream_id: this.lastID,
        user_id: userId,
        title,
        content,
        dream_date,
      });
    }
  );
};




exports.updateDream = (req, res) => {
  const userId = req.user.user_id;
  const dreamId = req.params.id;
  const { title, content, dream_date } = req.body;

  db.get(
    "SELECT * FROM dreams WHERE dream_id = ? AND user_id = ?",
    [dreamId, userId],
    (err, existingDream) => {
      if (err) return res.status(500).json(err);
      if (!existingDream) return res.status(404).json({ message: "Dream not found" });

      const nextTitle = title ?? existingDream.title;
      const nextContent = content ?? existingDream.content;
      const nextDate = dream_date ?? existingDream.dream_date;

      db.run(
        `
        UPDATE dreams
        SET title = ?, content = ?, dream_date = ?
        WHERE dream_id = ? AND user_id = ?
        `,
        [nextTitle, nextContent, nextDate, dreamId, userId],
        function (err) {
          if (err) return res.status(500).json(err);

          res.json({
            dream_id: Number(dreamId),
            user_id: userId,
            title: nextTitle,
            content: nextContent,
            dream_date: nextDate,
          });
        }
      );
    }
  );
};




exports.deleteDream = (req, res) => {
  const userId = req.user.user_id;
  const dreamId = req.params.id;

  db.run(
    "DELETE FROM dreams WHERE dream_id = ? AND user_id = ?",
    [dreamId, userId],
    function (err) {
      if (err) return res.status(500).json(err);

      if (this.changes === 0) {
        return res.status(404).json({ message: "Dream not found" });
      }

      res.json({ message: "Dream deleted" });
    }
  );
};



exports.toggleFavorite = (req, res) => {
  const userId = req.user.user_id;
  const dreamId = req.params.id;

  db.get(
    "SELECT * FROM dreams WHERE dream_id = ? AND user_id = ?",
    [dreamId, userId],
    (err, dream) => {
      if (err) return res.status(500).json(err);
      if (!dream) return res.status(404).json({ message: "Dream not found" });

      const nextFavorite = dream.is_favorite ? 0 : 1;

      db.run(
        "UPDATE dreams SET is_favorite = ? WHERE dream_id = ? AND user_id = ?",
        [nextFavorite, dreamId, userId],
        function (err) {
          if (err) return res.status(500).json(err);

          res.json({
            dream_id: Number(dreamId),
            user_id: Number(userId),
            is_favorite: nextFavorite,
          });
        }
      );
    }
  );
};