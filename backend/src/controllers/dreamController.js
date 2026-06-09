const db = require("../db/database");
const { success, error } = require("../utils/response");

// 꿈 목록 조회
exports.getDreams = (req, res) => {
  const user_id = req.user.user_id;
  const { date, tag, favorite } = req.query;

  let query = `
    SELECT d.*, GROUP_CONCAT(t.name) as tags
    FROM dreams d
    LEFT JOIN dream_tags dt ON d.dream_id = dt.dream_id
    LEFT JOIN tags t ON dt.tag_id = t.tag_id
    WHERE d.user_id = ?
  `;
  const params = [user_id];

  if (date) { query += " AND d.dream_date = ?"; params.push(date); }
  if (favorite === "true") { query += " AND d.is_favorite = 1"; }
  if (tag) {
    query += ` AND d.dream_id IN (
      SELECT dt2.dream_id FROM dream_tags dt2
      JOIN tags t2 ON dt2.tag_id = t2.tag_id
      WHERE t2.name = ?
    )`;
    params.push(tag);
  }
  query += " GROUP BY d.dream_id ORDER BY d.dream_date DESC";

  db.all(query, params, (err, rows) => {
    if (err) return error(res, 500, "DB_ERROR", err.message);
    const dreams = rows.map((d) => ({
      ...d,
      tags: d.tags ? d.tags.split(",") : [],
      is_favorite: d.is_favorite === 1,
    }));
    return success(res, 200, { dreams });
  });
};

// 꿈 상세 조회
exports.getDream = (req, res) => {
  const { id } = req.params;
  const user_id = req.user.user_id;

  db.get(`
    SELECT d.*, GROUP_CONCAT(t.name) as tags
    FROM dreams d
    LEFT JOIN dream_tags dt ON d.dream_id = dt.dream_id
    LEFT JOIN tags t ON dt.tag_id = t.tag_id
    WHERE d.dream_id = ? AND d.user_id = ?
    GROUP BY d.dream_id
  `, [id, user_id], (err, row) => {
    if (err) return error(res, 500, "DB_ERROR", err.message);
    if (!row) return error(res, 404, "DREAM_NOT_FOUND", "Dream not found");
    return success(res, 200, {
      dream: { ...row, tags: row.tags ? row.tags.split(",") : [], is_favorite: row.is_favorite === 1 }
    });
  });
};

// 꿈 생성
exports.createDream = (req, res) => {
  const { dream_date, title, content, tags = [] } = req.body;
  const user_id = req.user.user_id;

  if (!dream_date || !title || !content) {
    return error(res, 400, "VALIDATION_ERROR", "dream_date, title, content are required");
  }

  db.run(
    "INSERT INTO dreams (user_id, dream_date, title, content) VALUES (?, ?, ?, ?)",
    [user_id, dream_date, title, content],
    function (err) {
      if (err) return error(res, 500, "DB_ERROR", err.message);
      const dream_id = this.lastID;

      if (tags.length === 0) {
        return success(res, 201, { dream: { dream_id, dream_date, title, content, tags: [], is_favorite: false } });
      }

      // 태그 연결
      const placeholders = tags.map(() => "?").join(",");
      db.all(
        `SELECT tag_id, name FROM tags WHERE name IN (${placeholders})`,
        tags,
        (err, tagRows) => {
          if (err) return error(res, 500, "DB_ERROR", err.message);

          const insertStmt = tagRows.map(() => "(?, ?)").join(",");
          const insertParams = tagRows.flatMap((t) => [dream_id, t.tag_id]);

          db.run(
            `INSERT OR IGNORE INTO dream_tags (dream_id, tag_id) VALUES ${insertStmt}`,
            insertParams,
            (err) => {
              if (err) return error(res, 500, "DB_ERROR", err.message);
              return success(res, 201, {
                dream: { dream_id, dream_date, title, content, tags: tagRows.map((t) => t.name), is_favorite: false }
              });
            }
          );
        }
      );
    }
  );
};

// 꿈 수정
exports.updateDream = (req, res) => {
  const { id } = req.params;
  const { title, content, dream_date, tags } = req.body;
  const user_id = req.user.user_id;

  db.get("SELECT * FROM dreams WHERE dream_id = ? AND user_id = ?", [id, user_id], (err, row) => {
    if (err) return error(res, 500, "DB_ERROR", err.message);
    if (!row) return error(res, 404, "DREAM_NOT_FOUND", "Dream not found");

    db.run(
      "UPDATE dreams SET title=?, content=?, dream_date=?, updated_at=CURRENT_TIMESTAMP WHERE dream_id=?",
      [title ?? row.title, content ?? row.content, dream_date ?? row.dream_date, id],
      (err) => {
        if (err) return error(res, 500, "DB_ERROR", err.message);

        if (!tags) return success(res, 200, { message: "Dream updated successfully" });

        db.run("DELETE FROM dream_tags WHERE dream_id = ?", [id], (err) => {
          if (err) return error(res, 500, "DB_ERROR", err.message);
          if (tags.length === 0) return success(res, 200, { message: "Dream updated successfully" });

          const placeholders = tags.map(() => "?").join(",");
          db.all(`SELECT tag_id, name FROM tags WHERE name IN (${placeholders})`, tags, (err, tagRows) => {
            if (err) return error(res, 500, "DB_ERROR", err.message);
            const insertStmt = tagRows.map(() => "(?, ?)").join(",");
            const insertParams = tagRows.flatMap((t) => [id, t.tag_id]);
            db.run(`INSERT OR IGNORE INTO dream_tags (dream_id, tag_id) VALUES ${insertStmt}`, insertParams, (err) => {
              if (err) return error(res, 500, "DB_ERROR", err.message);
              return success(res, 200, { message: "Dream updated successfully" });
            });
          });
        });
      }
    );
  });
};

// 꿈 삭제
exports.deleteDream = (req, res) => {
  const { id } = req.params;
  const user_id = req.user.user_id;

  db.get("SELECT * FROM dreams WHERE dream_id = ? AND user_id = ?", [id, user_id], (err, row) => {
    if (err) return error(res, 500, "DB_ERROR", err.message);
    if (!row) return error(res, 404, "DREAM_NOT_FOUND", "Dream not found");

    db.run("DELETE FROM dream_tags WHERE dream_id = ?", [id], (err) => {
      if (err) return error(res, 500, "DB_ERROR", err.message);
      db.run("DELETE FROM dreams WHERE dream_id = ?", [id], (err) => {
        if (err) return error(res, 500, "DB_ERROR", err.message);
        return success(res, 200, { message: "Dream deleted successfully" });
      });
    });
  });
};

const { generateDreamSummary } = require("../services/aiService");

exports.generateSummary = (req, res) => {
  const { id } = req.params;
  const user_id = req.user.user_id;

  db.get(
    "SELECT * FROM dreams WHERE dream_id = ? AND user_id = ?",
    [id, user_id],
    async (err, dream) => {
      if (err) return error(res, 500, "DB_ERROR", err.message);
      if (!dream) return error(res, 404, "DREAM_NOT_FOUND", "Dream not found");

      try {
        const ai_summary = await generateDreamSummary(dream.content);

        db.run(
          "UPDATE dreams SET ai_summary = ?, updated_at = CURRENT_TIMESTAMP WHERE dream_id = ?",
          [ai_summary, id],
          (err) => {
            if (err) return error(res, 500, "DB_ERROR", err.message);
            return success(res, 200, {
              message: "AI summary generated successfully",
              ai_summary,
            });
          }
        );
      } catch (err) {
        console.error("Summary error:", err);
        return error(res, 500, "AI_SUMMARY_FAILED", "Failed to generate AI summary.");
      }
    }
  );
};

// 즐겨찾기 토글
exports.toggleFavorite = (req, res) => {
  const { id } = req.params;
  const user_id = req.user.user_id;

  db.get("SELECT * FROM dreams WHERE dream_id = ? AND user_id = ?", [id, user_id], (err, row) => {
    if (err) return error(res, 500, "DB_ERROR", err.message);
    if (!row) return error(res, 404, "DREAM_NOT_FOUND", "Dream not found");

    const newVal = row.is_favorite === 1 ? 0 : 1;
    db.run("UPDATE dreams SET is_favorite = ? WHERE dream_id = ?", [newVal, id], (err) => {
      if (err) return error(res, 500, "DB_ERROR", err.message);
      return success(res, 200, { message: "Favorite updated", is_favorite: newVal === 1 });
    });
  });
};