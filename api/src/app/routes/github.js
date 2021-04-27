const router = require("express").Router();
const dbPromise = require("../../config/database");
const axios = require("axios");
require("dotenv").config();

async function getUser(token) {
  const response = await axios.get("https://api.github.com/user", {
    headers: { authorization: `token ${token}` },
  });
  return await response.data;
}

router.get("/", (req, res) => {
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=repo`
  );
});

router.get("/github-auth-callback", async (req, res) => {
  try {
    const code = req.query.code;
    const body = {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code: code,
    };
    const opts = { headers: { accept: "application/json" } };
    const response = await axios.post(
      `https://github.com/login/oauth/access_token`,
      body,
      opts
    );
    const token = await response.data.access_token;
    const user = await getUser(token);

    const db = await dbPromise;
    const inserToken = await db.run(
      "INSERT OR IGNORE INTO auth (token, username) VALUES (?, ?)",
      [token, user.login]
    );

    res.redirect(
      `${process.env.APP_URL}?username=${user.login}&token=${token}`
    );
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

router.post("/github-logout-user", async (req, res) => {
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

  try {
    const token = req.body.token;
    const username = req.body.username;
    const db = await dbPromise;
    await db.run("DELETE FROM auth WHERE token = ? AND username = ?", [
      token,
      username,
    ]);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

router.get("/github-get-userdata/:token", async (req, res) => {
  try {
    const sql = "SELECT * FROM auth WHERE token = ?";
    const db = await dbPromise;
    const user = await db.get(sql, req.params.token);
    const token = user.token;

    const response = await axios.get("https://api.github.com/user", {
      headers: { authorization: `token ${token}` },
    });

    res.json({ userdata: response.data });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

router.post("/github-repositories", async (req, res) => {
  try {
    const token = req.body.token;
    const user = req.body.user;
    const response = await axios.get(
      "https://api.github.com/search/repositories?q=user:" +
        user +
        "&id=171121436",
      {
        headers: { authorization: `token ${token}` },
      }
    );
    const repositories = response.data.items;

    const sql =
      "SELECT * FROM rel_tags_repository as rtr INNER JOIN tags as t ON t.id = rtr.tagId WHERE rtr.repositoryId = ?";
    const db = await dbPromise;

    await Promise.all(
      repositories.map(async (r) => {
        try {
          const repo = await db.all(sql, r.id);
          r.tags = repo;
          return r;
        } catch (err) {
          throw err;
        }
      })
    );

    res.json({ repositories });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

router.post("/github-repository/:id", async (req, res) => {
  try {
    const token = req.body.token;
    const user = req.body.user;
    const response = await axios.get(
      "https://api.github.com/repos/" + user + "/" + req.params.id,
      { headers: { authorization: `token ${token}` } }
    );

    const { id, name, full_name, description, clone_url } = await response.data;

    const repoData = {
      id,
      name,
      full_name,
      description,
      clone_url,
    };
    const sql =
      "SELECT * FROM rel_tags_repository as rtr INNER JOIN tags as t ON t.id = rtr.tagId WHERE rtr.repositoryId = ?";

    const db = await dbPromise;
    const tags = await db.all(sql, id);

    repoData.tags = tags ? tags.map((row) => row.tagId) : [];
    repoData.tagsDesc = tags ? tags.map((row) => row.title) : [];
    res.json({ userdata: repoData });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

router.post("/rel-tags/", async (req, res) => {
  var errors = [];
  if (!req.body.repoId) {
    errors.push("Id do repositório não informado");
  }

  if (errors.length) {
    res.status(400).json({ error: errors.join(",") });
    return;
  }

  try {
    const repoId = req.body.repoId;
    const tags = req.body.tags;

    relData = [];
    if (tags) {
      tags.map((tag) => {
        relData.push([repoId, tag]);
      });
    }

    const db = await dbPromise;
    await db.run(
      "DELETE FROM rel_tags_repository WHERE repositoryId = ?",
      repoId
    );

    const sql = `INSERT INTO rel_tags_repository (
      repositoryId,
      tagId
    ) VALUES (?, ?)`;

    for (var i = 0; i < relData.length; i++) {
      await db.run(sql, relData[i][0], relData[i][1]);
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
