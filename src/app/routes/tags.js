const router = require("express").Router();
const queries = require("../../config/queries/queriesTags");

const axios = require("axios");
require("dotenv").config();

async function getUser(token) {
  const response = await axios.get("https://api.github.com/user", {
    headers: { authorization: `token ${token}` },
  });
  return await response.data;
}

router.post("/", async (req, res) => {
  let errors = [];
  if (!req.body.token) {
    errors.push("Token is required");
  }
  if (errors.length) {
    res.status(400).json({ error: errors.join(",") });
    return;
  }
  try {
    const user = await getUser(req.body.token);
    const tags = await queries.getAll(user.id);
    res.json({ data: tags });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

router.get("/:id", async (req, res) => {
  let errors = [];
  if (!req.params.id) {
    errors.push("Tag ID is required");
  }
  if (errors.length) {
    res.status(400).json({ error: errors.join(",") });
    return;
  }
  try {
    const tag = await queries.getOne(req.params.id);
    res.json({ data: tag });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

router.post("/save", async (req, res) => {
  let errors = [];
  if (!req.body.title) {
    errors.push("Title is required");
  }
  if (errors.length) {
    res.status(400).json({ error: errors.join(",") });
    return;
  }
  try {
    const user = await getUser(req.body.token);
    const tag = {
      title: req.body.title,
      content: req.body.content ? req.body.content : "",
      image_url: req.body.image_url ? req.body.image_url : "",
      user_id: user.id,
    };
    const created = await queries.create(tag);
    res.json({
      message: "success",
      data: created[0],
      id: created[0].id,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

router.put("/save/:id", async (req, res, next) => {
  let errors = [];
  if (!req.params.id) {
    errors.push("Tag ID is required");
  }
  if (errors.length) {
    res.status(400).json({ error: errors.join(",") });
    return;
  }
  try {
    const tag = {
      title: req.body.title,
      content: req.body.content,
      image_url: req.body.image_url,
    };

    const updated = await queries.update(req.params.id, tag);
    res.json({
      message: "success",
      data: updated[0],
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

router.delete("/:id", async (req, res) => {
  let errors = [];
  if (!req.params.id) {
    errors.push("Tag ID is required");
  }
  if (errors.length) {
    res.status(400).json({ error: errors.join(",") });
    return;
  }
  try {
    await queries.delete(req.params.id);
    res.json({ message: "deleted" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
