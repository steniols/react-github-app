const queries = require("../../config/queries/queriesGithub");
const github = require("../services/github");

// Requires an "Authorization: Bearer <token>" header with a token issued by our
// OAuth callback. Exposes the GitHub user as req.user and the token as req.token.
module.exports = async function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ message: ["Token is required"] });
  }
  try {
    if (!(await queries.getToken(token))) {
      return res.status(401).json({ message: ["Invalid token"] });
    }
    req.user = await github.getUser(token);
    req.token = token;
    next();
  } catch (error) {
    if (error.response?.status === 401) {
      await queries.deleteToken({ token });
      return res.status(401).json({ message: ["Invalid token"] });
    }
    console.log(error.message);
    res.status(500).json({ message: ["Server Error"] });
  }
};
