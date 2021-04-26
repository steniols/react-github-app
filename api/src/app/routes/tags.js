const router = require("express").Router();
const db = require("../../config/database");
const axios = require("axios");
require("dotenv").config();

async function getUser(token) {
  const response = await axios.get("https://api.github.com/user", {
    headers: { authorization: `token ${token}` },
  });
  return await response.data;
}

router.post("/", (req, res) => {
  getUser(req.body.token).then((_res) => {
    const sql = "select * from tags where userID = ?";
    db.all(sql, _res.id, (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: "success",
        data: rows,
      });
    });
  });
});

router.get("/:id", (req, res) => {
  const sql = "select * from tags where id = ?";
  const params = [req.params.id];
  db.all(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: row,
    });
  });
});

router.post("/save", (req, res) => {
  var errors = [];
  if (!req.body.title) {
    errors.push("Título não informado");
  }
  if (errors.length) {
    res.status(400).json({ error: errors.join(",") });
    return;
  }

  getUser(req.body.token).then((_res) => {
    var tag = {
      title: req.body.title,
      content: req.body.content ? req.body.content : "",
      imageUrl: req.body.imageUrl ? req.body.imageUrl : "",
      userId: _res.id,
    };
    var sql = `
        INSERT INTO tags (
          title,
          content,
          imageUrl,
          userId
        ) VALUES (?, ?, ?, ?)
        `;
    var params = [tag.title, tag.content, tag.imageUrl, tag.userId];
    db.run(sql, params, function (err, result) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: "success",
        data: tag,
        id: this.lastID,
      });
    });
  });
});

router.put("/save/:id", (req, res, next) => {
  var tag = {
    title: req.body.title,
    content: req.body.content,
    imageUrl: req.body.imageUrl,
  };
  db.run(
    `UPDATE tags set 
                title = COALESCE(?,title), 
                content = COALESCE(?,content),
                imageUrl= COALESCE(?,imageUrl)
            WHERE id = ?`,
    [tag.title, tag.content, tag.imageUrl, req.params.id],
    function (err, result) {
      if (err) {
        res.status(400).json({ error: res.message });
        return;
      }
      res.json({
        message: "success",
        data: tag,
        changes: this.changes,
      });
    }
  );
});

router.delete("/:id", (req, res) => {
  db.run(
    "DELETE FROM tags WHERE id = ?",
    req.params.id,
    function (err, result) {
      if (err) {
        res.status(400).json({ error: res.message });
        return;
      }
      res.json({ message: "deleted", changes: this.changes });
    }
  );
});

module.exports = router;
