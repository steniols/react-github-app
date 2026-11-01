const app = require("./src/config/express");

const port = process.env.PORT || 8003;

app.listen(port, () => {
  console.log(`server has started on port ${port} (${app.get("env")})`);
  if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET) {
    console.warn("Warning: CLIENT_ID / CLIENT_SECRET are not set in .env, GitHub login will not work.");
  }
});
