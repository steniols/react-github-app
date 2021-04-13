const db = require("../../config/database");
const md5 = require("md5");
const axios = require("axios");

module.exports = (app) => {
  //   app.get("/", (req, res) => {
  //     res.json({ message: "Hello api!" });
  //   });

  app.get("/", (req, res) => {
    const clientId = "b04eb0c348dd9a0c2caa";
    const clientSecret = "cb545e38b9749007fac4103fa589ba0644b44251";
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo`
    );
  });

  app.get("/oauth-callback", (req, res) => {
    const clientId = "b04eb0c348dd9a0c2caa";
    const clientSecret = "cb545e38b9749007fac4103fa589ba0644b44251";
    const body = {
      client_id: clientId,
      client_secret: clientSecret,
      code: req.query.code,
    };

    const opts = { headers: { accept: "application/json" } };
    axios
      .post(`https://github.com/login/oauth/access_token`, body, opts)
      .then((res) => res.data.access_token)
      .then((_token) => {
        console.log("My token:", _token);

        // Insert token on datatabase or localStorage

        const token = _token;
        res.json({ ok: 1 });
      })
      .catch((err) => res.status(500).json({ message: err.message }));
  });

  app.get("/github-userdata", (req, res) => {
    // Replace 'Thanks' with 'Thank You' in the comment text.
    const token = "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";
    // axios
    //   .get("https://api.github.com/user", {
    //     headers: { authorization: `token ${token}` },
    //   })
    //   .then((res) => console.log(res));
    axios
      .get("https://api.github.com/search/repositories?q=user:steniols", {
        headers: { authorization: `token ${token}` },
      })
      .then((res) => console.log(res.data));
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
