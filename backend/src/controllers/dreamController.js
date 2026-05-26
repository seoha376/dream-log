const db = require("../db/database");

exports.getDreams = (req, res) => {
  db.all(
    "SELECT * FROM dreams",
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json(rows);
    }
  );
};