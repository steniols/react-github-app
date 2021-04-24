import axios from "axios";
import env from "react-dotenv";

const apiUrl = env.API_URL;

const githubService = {
  async getUser() {
    const token = localStorage.getItem("tokenGithub");
    if (token) {
      let endpoint = apiUrl + "/github-get-userdata/" + token;
      const result = await axios.get(endpoint);
      if (result.data.userdata?.login) {
        localStorage.setItem("loginGithub", result.data.userdata.login);
        localStorage.setItem("nameGithub", result.data.userdata.name);
        return {
          login: result.data.userdata.login,
          name: result.data.userdata.name,
        };
      } else {
        return false;
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
    return result.data.userdata.items;
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
    console.log("data", result);
    return result;
  },
};

export default githubService;
