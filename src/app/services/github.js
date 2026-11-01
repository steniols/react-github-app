const axios = require("axios");

const api = axios.create({
  baseURL: "https://api.github.com",
  headers: { accept: "application/vnd.github+json" },
});

const auth = (token) => ({ headers: { authorization: `Bearer ${token}` } });

module.exports = {
  async getUser(token) {
    const response = await api.get("/user", auth(token));
    return response.data;
  },

  async getRepositories(token) {
    // /user/repos is paginated (max 100 per page) and includes private repositories
    let repositories = [];
    for (let page = 1; ; page++) {
      const response = await api.get("/user/repos", {
        ...auth(token),
        params: { affiliation: "owner", per_page: 100, page },
      });
      repositories = repositories.concat(response.data);
      if (response.data.length < 100) return repositories;
    }
  },

  async getRepository(token, owner, name) {
    const response = await api.get(`/repos/${owner}/${name}`, auth(token));
    return response.data;
  },
};
