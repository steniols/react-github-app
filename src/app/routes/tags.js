const router = require("express").Router();
const queries = require("../../config/queries/queriesTags");
const auth = require("../middlewares/auth");

function serverError(res, error) {
  console.log(error.message);
  res.status(500).json({ message: ["Server Error"] });
}

function parseId(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ message: ["Tag ID is required"] });
    return null;
  }
  return id;
}

function tagFromBody(body) {
  return {
    title: body.title.trim(),
    content: body.content || "",
    image_url: body.image_url || "",
  };
}

router.use(auth);

router.get("/", async (req, res) => {
  try {
    res.json({ data: await queries.getAll(req.user.id) });
  } catch (error) {
    serverError(res, error);
  }
});

router.get("/:id", async (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;
  try {
    const tag = await queries.getOne(id, req.user.id);
    if (!tag) {
      return res.status(404).json({ message: ["Tag not found"] });
    }
    res.json({ data: tag });
  } catch (error) {
    serverError(res, error);
  }
});

router.post("/save", async (req, res) => {
  if (!req.body.title?.trim()) {
    return res.status(400).json({ message: ["Title is required"] });
  }
  try {
    const created = await queries.create({ ...tagFromBody(req.body), user_id: req.user.id });
    res.json({
      message: "Tag saved with success",
      data: created[0],
      id: created[0].id,
    });
  } catch (error) {
    serverError(res, error);
  }
});

router.put("/save/:id", async (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;
  if (!req.body.title?.trim()) {
    return res.status(400).json({ message: ["Title is required"] });
  }
  try {
    const updated = await queries.update(id, req.user.id, tagFromBody(req.body));
    if (!updated.length) {
      return res.status(404).json({ message: ["Tag not found"] });
    }
    res.json({
      message: "Tag updated with success",
      data: updated[0],
    });
  } catch (error) {
    serverError(res, error);
  }
});

router.delete("/:id", async (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;
  try {
    if (!(await queries.delete(id, req.user.id))) {
      return res.status(404).json({ message: ["Tag not found"] });
    }
    res.json({ message: "Tag deleted with success" });
  } catch (error) {
    serverError(res, error);
  }
});

module.exports = router;
