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

  // async getGithubToken() {
  //   let endpoint = apiUrl + "/github-get-token/";
  //   const result = await axios.get(endpoint);
  //   localStorage.setItem("tokenGithub", result.data.token);
  // },

  async getUser() {
    let endpoint = apiUrl + "/github-get-userdata/";
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
  },

  clearLoggedUser() {
    localStorage.clear();
  },

  // async gitHubReposData() {
  //   const token = localStorage.getItem("tokenGithub");
  //   const user = localStorage.getItem("loginGithub");
  //   let endpoint = apiUrl + "/github-respositories";
  //   const data = {
  //     token: token,
  //     user: user,
  //   };
  //   const result = await axios.post(endpoint, data);
  //   console.log(result);
  // },
};

export default githubService;
