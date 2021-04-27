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

router.get("/", async (req, res) => {
  try {
    const db = await dbPromise;
    const user = await getUser("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");
    const sql = "select * from tags where userID = ?";
    const tags = await db.all(sql, user.id);
    res.json({ tags });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

router.post("/", async (req, res) => {
  try {
    const db = await dbPromise;
    const user = await getUser(req.body.token);
    const sql = "select * from tags where userID = ?";
    const tags = await db.all(sql, user.id);
    res.json({
      message: "success",
      data: tags,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const db = await dbPromise;
    const sql = "select * from tags where id = ?";
    const params = [req.params.id];
    const tag = await db.all(sql, params);
    res.json({
      message: "success",
      data: tag,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

router.post("/save", async (req, res) => {
  var errors = [];
  if (!req.body.title) {
    errors.push("Título não informado");
  }
  if (errors.length) {
    res.status(400).json({ error: errors.join(",") });
    return;
  }

  try {
    const db = await dbPromise;
    const user = await getUser(req.body.token);
    var tag = {
      title: req.body.title,
      content: req.body.content ? req.body.content : "",
      imageUrl: req.body.imageUrl ? req.body.imageUrl : "",
      userId: user.id,
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
    await db.run(sql, params);

    res.json({
      message: "success",
      data: tag,
      id: this.lastID,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

router.put("/save/:id", async (req, res, next) => {
  try {
    const db = await dbPromise;
    const tag = {
      title: req.body.title,
      content: req.body.content,
      imageUrl: req.body.imageUrl,
    };

    const sql = `UPDATE tags set 
      title = COALESCE(?,title), 
      content = COALESCE(?,content),
      imageUrl= COALESCE(?,imageUrl)
      WHERE id = ?`;

    await db.run(sql, [tag.title, tag.content, tag.imageUrl, req.params.id]);
    res.json({
      message: "success",
      data: tag,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const db = await dbPromise;
    await db.run("DELETE FROM tags WHERE id = ?", req.params.id);
    res.json({ message: "deleted" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
