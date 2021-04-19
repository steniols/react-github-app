import axios from "axios";

const apiUrl = "http://localhost:8003/api";

const githubService = {
  // async loginGithub(code) {
  //   let endpoint = apiUrl + "/github-auth/" + code;
  //   const result = await axios.get(endpoint);
  //   if (result.data?.token) {
  //     localStorage.clear();
  //     localStorage.setItem("tokenGithub", result.data.token);
  //     const userdata = await this.getUser();

  //     return {
  //       token: result.data.token,
  //       user: userdata,
  //     };
  //   }

  //   return false;
  // },

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
};

export default githubService;
