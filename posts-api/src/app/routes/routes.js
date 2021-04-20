const db = require("../../config/database");
const md5 = require("md5");
const axios = require("axios");

async function getUser(token) {
  const response = await axios.get("https://api.github.com/user", {
    headers: { authorization: `token ${token}` },
  });

  return await response.data;
}

module.exports = (app) => {
  const clientId = "b04eb0c348dd9a0c2caa";
  const clientSecret = "cb545e38b9749007fac4103fa589ba0644b44251";

  app.get("/", (req, res) => {
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo`
    );
  });

  app.get("/api/github-auth-callback", (req, res) => {
    const code = req.query.code;
    const body = {
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
    };

    const opts = { headers: { accept: "application/json" } };
    axios
      .post(`https://github.com/login/oauth/access_token`, body, opts)
      .then((res) => res.data.access_token)
      .then((token) => {
        getUser(token).then((_res) => {
          db.run("INSERT OR IGNORE INTO auth (token, username) VALUES (?, ?)", [
            token,
            userdata.login,
          ]);
          res.redirect(
            `http://localhost:3000/?username=${_res.login}&token=${token}`
          );
        });
      });
  });

  app.post("/api/github-logout-user", (req, res) => {
    var errors = [];
    if (!req.body.token) {
      errors.push("Token não informado");
    }
    if (!req.body.username) {
      errors.push("Username não informado");
    }
    if (errors.length) {
      res.status(400).json({ error: errors.join(",") });
      return;
    }
    const token = req.body.token;
    const username = req.body.username;

    db.run("DELETE FROM auth WHERE token = ? AND username = ?", [
      token,
      username,
    ]);
  });

  app.get("/api/github-get-userdata/:token", (req, res) => {
    const sql = "SELECT * FROM auth WHERE token = ?";
    db.get(sql, req.params.token, (err, row) => {
      if (err) {
        throw err;
      }
      const token = row.token;
      axios
        .get("https://api.github.com/user", {
          headers: { authorization: `token ${token}` },
        })
        .then((_res) => {
          res.json({ userdata: _res.data });
        })
        .catch((error) => {
          res.json({ error: true, error_details: error });
        });
    });
  });

  app.post("/api/github-repositories", (req, res) => {
    const token = req.body.token;
    const user = req.body.user;

    console.log("token", token);
    console.log("user", user);

    axios
      .get("https://api.github.com/search/repositories?q=user:" + user, {
        headers: { authorization: `token ${token}` },
      })
      .then((_res) => {
        res.json({ userdata: _res.data });
      });
  });

  app.post("/api/tags/", (req, res) => {
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

  app.post("/api/tags/save", (req, res) => {
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

  app.put("/api/tags/save/:id", (req, res, next) => {
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

  app.get((request, response) => {
    response.status(404);
  });
};
