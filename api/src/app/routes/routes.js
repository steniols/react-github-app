const db = require("../../config/database");
const md5 = require("md5");
const axios = require("axios");

require("dotenv").config();

async function getUser(token) {
  const response = await axios.get("https://api.github.com/user", {
    headers: { authorization: `token ${token}` },
  });
  return await response.data;
}

module.exports = (app) => {
  app.get("/", (req, res) => {
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=repo`
    );
  });

  app.get("/api/github-auth-callback", (req, res) => {
    const code = req.query.code;
    const body = {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
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
            _res.login,
          ]);
          res.redirect(
            `${process.env.APP_URL}?username=${_res.login}&token=${token}`
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

  app.post("/api/github-repositories", async (req, res) => {
    const token = req.body.token;
    const user = req.body.user;

    const _res = await axios.get(
      "https://api.github.com/search/repositories?q=user:" +
        user +
        "&id=171121436",
      {
        headers: { authorization: `token ${token}` },
      }
    );

    const repositorios = _res.data.items;
    res.json({ userdata: _res.data });
  });

  app.post("/api/github-repository/:id", (req, res) => {
    const token = req.body.token;
    const user = req.body.user;

    axios
      .get("https://api.github.com/repos/" + user + "/" + req.params.id, {
        headers: { authorization: `token ${token}` },
      })
      .then((_res) => {
        const repositoryId = _res.data.id;
        const { id, name, full_name, description, clone_url } = _res.data;

        const repoData = {
          id,
          name,
          full_name,
          description,
          clone_url,
        };

        const sql =
          "SELECT * FROM rel_tags_repository as rtr INNER JOIN tags as t ON t.id = rtr.tagId WHERE rtr.repositoryId = ?";
        db.all(sql, repositoryId, (err, rows) => {
          repoData.tags = rows ? rows.map((row) => row.tagId) : [];
          repoData.tagsDesc = rows ? rows.map((row) => row.title) : [];
          res.json({ userdata: repoData });
        });
      });
  });

  app.post("/api/rel-tags/", (req, res) => {
    var errors = [];
    if (!req.body.repoId) {
      errors.push("Id do repositório não informado");
    }

    if (errors.length) {
      res.status(400).json({ error: errors.join(",") });
      return;
    }

    const repoId = req.body.repoId;
    const tags = req.body.tags;

    relData = [];
    if (tags) {
      tags.map((tag) => {
        relData.push([repoId, tag]);
      });
    }

    db.run(
      "DELETE FROM rel_tags_repository WHERE repositoryId = ?",
      repoId,
      function (err, result) {
        if (err) {
          res.status(400).json({ error: res.message });
          return;
        }
      }
    );

    const sql = `INSERT INTO rel_tags_repository (
      repositoryId,
      tagId
    ) VALUES (?, ?)`;

    for (var i = 0; i < relData.length; i++) {
      db.run(sql, relData[i][0], relData[i][1]);
    }
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
