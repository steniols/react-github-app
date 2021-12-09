import axios from "axios";
import env from "react-dotenv";

const apiUrl = env && env.API_URL ? `${env.API_URL}/github` : "/github";

const githubService = {
  async getUser() {
    const token = localStorage.getItem("tokenGithub");
    if (token) {
      try {
        const url = `${apiUrl}/github-get-userdata/${token}`;
        const result = await axios.get(url);
        if (await result.data.data?.login) {
          localStorage.setItem("loginGithub", result.data.data.login);
          localStorage.setItem("nameGithub", result.data.data.name);
          return {
            login: result.data.data.login,
            name: result.data.data.name,
          };
        } else {
          return false;
        }
      } catch (error) {
        console.log(error);
      }
    }
    return false;
  },

  async clearLoggedUser() {
    const token = localStorage.getItem("tokenGithub");
    const username = localStorage.getItem("loginGithub");
    const url = `${apiUrl}/github-logout-user`;
    const data = {
      token: token,
      username: username,
    };
    localStorage.clear();
    const result = await axios.post(url, data);
    return result;
  },

  async getRepos(search = false) {
    try {
      const token = localStorage.getItem("tokenGithub");
      const user = localStorage.getItem("loginGithub");
      const url = `${apiUrl}/github-repositories`;
      const data = {
        token: token,
        user: user,
        search: search,
      };
      const result = await axios.post(url, data);
      const repositories = await result.data.repositories;
      return repositories;
    } catch (error) {
      console.log(error);
      throw new Error("Ocorreu um erro ao resgatar os repositórios.");
    }
  },

  async getRepo(repoId) {
    const token = localStorage.getItem("tokenGithub");
    const user = localStorage.getItem("loginGithub");
    const url = `${apiUrl}/github-repository/${repoId}`;
    const data = {
      token: token,
      user: user,
    };
    const result = await axios.post(url, data);
    console.log(result);
    return result;
  },

  async relTags(repoId, tags) {
    let url = `${apiUrl}/rel-tags`;
    const data = {
      repoId: repoId,
      tags: tags,
    };
    const result = await axios.post(url, data);
    return result.data;
  },
};

export default githubService;
