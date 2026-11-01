const router = require("express").Router();
const axios = require("axios");
const queries = require("../../config/queries/queriesGithub");
const tagQueries = require("../../config/queries/queriesTags");
const github = require("../services/github");
const auth = require("../middlewares/auth");

function serverError(res, error) {
  console.log(error.message);
  res.status(500).json({ message: ["Server Error"] });
}

router.get("/", (req, res) => {
  if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET) {
    return res
      .status(500)
      .send("CLIENT_ID / CLIENT_SECRET are not set in .env (restart the API after editing it).");
  }
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=repo`
  );
});

router.get("/github-auth-callback", async (req, res) => {
  try {
    const body = {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code: req.query.code,
    };
    const opts = { headers: { accept: "application/json" } };
    const response = await axios.post(
      "https://github.com/login/oauth/access_token",
      body,
      opts
    );
    if (response.data.error) {
      throw new Error(response.data.error_description || response.data.error);
    }
    const token = response.data.access_token;
    const user = await github.getUser(token);
    await queries.saveToken({ token, username: user.login });
    const appUrl = process.env.NODE_ENV == "production" ? "/" : process.env.APP_URL;
    res.redirect(`${appUrl}?username=${user.login}&token=${token}`);
  } catch (error) {
    serverError(res, error);
  }
});

router.post("/github-logout-user", auth, async (req, res) => {
  try {
    await queries.deleteToken({ token: req.token });
    res.json({ message: "Logged out" });
  } catch (error) {
    serverError(res, error);
  }
});

router.get("/github-get-userdata", auth, (req, res) => {
  res.json({ data: req.user });
});

router.post("/github-repositories", auth, async (req, res) => {
  try {
    const repositories = await github.getRepositories(req.token);
    await Promise.all(
      repositories.map((r) =>
        queries.saveRepository({
          repository_id: r.id,
          name: r.name,
          full_name: r.full_name,
          description: r.description,
          clone_url: r.clone_url,
          html_url: r.html_url,
          user_id: r.owner.id,
        })
      )
    );
    res.json({
      repositories: await queries.getAllRepositories(req.user.id, req.body.search),
    });
  } catch (error) {
    serverError(res, error);
  }
});

router.get("/github-repository/:name", auth, async (req, res) => {
  try {
    const { id } = await github.getRepository(req.token, req.user.login, req.params.name);
    const repository = await queries.getOneRepository(id, req.user.id);
    if (!repository) {
      return res.status(404).json({ message: ["Repository not found"] });
    }
    res.json({ data: repository });
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({ message: ["Repository not found"] });
    }
    serverError(res, error);
  }
});

router.post("/rel-tags", auth, async (req, res) => {
  const repoId = Number(req.body.repoId);
  if (!Number.isInteger(repoId)) {
    return res.status(400).json({ message: ["Repository ID is required"] });
  }
  try {
    const repository = await queries.getOneRepository(repoId, req.user.id);
    if (!repository) {
      return res.status(404).json({ message: ["Repository not found"] });
    }
    // Only keep tags that belong to the logged user
    const requested = (req.body.tags || []).map(Number).filter(Number.isInteger);
    const tags = requested.length ? await tagQueries.getIds(requested, req.user.id) : [];
    await queries.setRepositoryTags(repoId, tags);
    res.json({ message: "Repository tags updated with success" });
  } catch (error) {
    serverError(res, error);
  }
});

module.exports = router;
