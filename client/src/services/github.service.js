import axios from "axios";
import env from "react-dotenv";

const apiUrl = env.API_URL ? `${env.API_URL}/github` : "/github";

const githubService = {
  async getUser() {
    const token = localStorage.getItem("tokenGithub");
    if (token) {
      try {
        const endpoint = apiUrl + "/github-get-userdata/" + token;
        const result = await axios.get(endpoint);
        if (await result.data.userdata?.login) {
          localStorage.setItem("loginGithub", result.data.userdata.login);
          localStorage.setItem("nameGithub", result.data.userdata.name);
          return {
            login: result.data.userdata.login,
            name: result.data.userdata.name,
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

    localStorage.clear();

    let endpoint = apiUrl + "/github-logout-user";
    const data = {
      token: token,
      username: username,
    };
    const result = await axios.post(endpoint, data);
    return result;
  },

  async getRepos() {
    const token = localStorage.getItem("tokenGithub");
    const user = localStorage.getItem("loginGithub");
    let endpoint = apiUrl + "/github-repositories";
    const data = {
      token: token,
      user: user,
    };
    const result = await axios.post(endpoint, data);
    const repositories = result.data.repositories;

    return repositories;
  },

  async getRepo(repoId) {
    const token = localStorage.getItem("tokenGithub");
    const user = localStorage.getItem("loginGithub");

    const endpoint = apiUrl + "/github-repository/" + repoId;
    const data = {
      token: token,
      user: user,
    };
    const result = await axios.post(endpoint, data);
    return result;
  },

  async relTags(repoId, tags) {
    let endpoint = apiUrl + "/rel-tags";
    const data = {
      repoId: repoId,
      tags: tags,
    };
    const result = await axios.post(endpoint, data);
    return result.data;
  },
};

export default githubService;
