import api from "./api";

const githubService = {
  async getUser() {
    if (!localStorage.getItem("tokenGithub")) return false;
    try {
      const result = await api.get("/github/github-get-userdata");
      const { login, name } = result.data.data;
      localStorage.setItem("loginGithub", login);
      localStorage.setItem("nameGithub", name || login);
      return { login, name: name || login };
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
      }
      console.log(error);
      return false;
    }
  },

  async clearLoggedUser() {
    try {
      await api.post("/github/github-logout-user");
    } finally {
      localStorage.clear();
    }
  },

  async getRepos(search = "") {
    try {
      const result = await api.post("/github/github-repositories", { search });
      return result.data.repositories;
    } catch (error) {
      console.log(error);
      throw new Error("Ocorreu um erro ao resgatar os repositórios.");
    }
  },

  async getRepo(repoName) {
    return api.get(`/github/github-repository/${encodeURIComponent(repoName)}`);
  },

  async relTags(repoId, tags) {
    const result = await api.post("/github/rel-tags", { repoId, tags });
    return result.data;
  },
};

export default githubService;
