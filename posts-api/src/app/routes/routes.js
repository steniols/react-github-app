const db = require("../../config/database");
const md5 = require("md5");

module.exports = (app) => {
  app.get("/", (req, res) => {
    res.json({ message: "Hello api!" });
  });

  app.get("/api/tags/", (req, res) => {
    const sql = "select * from tags";
    db.all(sql, (err, rows) => {
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

  app.get("/api/tags/:id", (req, res) => {
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

  app.post("/api/tags/", (req, res) => {
    var errors = [];
    if (!req.body.title) {
      errors.push("Título não informado");
    }
    if (errors.length) {
      res.status(400).json({ error: errors.join(",") });
      return;
    }
    var tag = {
      title: req.body.title,
      content: req.body.content ? req.body.content : "",
      imageUrl: req.body.imageUrl ? req.body.imageUrl : "",
    };
    var sql = `
			INSERT INTO tags (
				title,
				content,
				imageUrl
			) VALUES (?, ?, ?)
    	`;
    var params = [tag.title, tag.content, tag.imageUrl];

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

  app.put("/api/tags/:id", (req, res, next) => {
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
          console.log(err);
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

  app.delete("/api/tags/:id", (req, res) => {
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

  app.post("/api/auth", (req, res) => {
    const sql = "select * from users where email = ?";
    const params = [req.body.email];
    db.all(sql, params, (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (!row || !row[0]) {
        res.status(404).json({ error: "User not found." });
        return;
      }
      if (row[0].password != md5(req.body.password)) {
        res.status(400).json({ error: "Wrong login data." });
        return;
      }
      res.json({
        message: "success",
        data: {
          email: row[0].email,
          name: row[0].name,
        },
      });
    });
  });

  app.get((request, response) => {
    response.status(404);
  });
};
