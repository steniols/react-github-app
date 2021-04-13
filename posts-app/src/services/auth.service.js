import axios from "axios";

const apiUrl = "http://localhost:8002/api";
const clientId = "b04eb0c348dd9a0c2caa";
const clientSecret = "cb545e38b9749007fac4103fa589ba0644b44251";

const authService = {
  // async sendLogin(data) {
  //   let endpoint = apiUrl + "/auth";
  //   return axios.post(endpoint, data);
  // },

  // setLoggedUser(userData) {
  //   try {
  //     let parsedData = JSON.stringify(userData);
  //     localStorage.setItem("user", parsedData);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },

  // getLoggedUser() {
  //   try {
  //     let userData = localStorage.getItem("user");
  //     if (!userData) return null;
  //     let parsedData = JSON.parse(userData);
  //     return parsedData;
  //   } catch (error) {
  //     console.log(error);
  //     return null;
  //   }
  // },

  async loginGithub(code) {
    let endpoint = apiUrl + "/github-auth/" + code;
    const result = await axios.get(endpoint);
    if (result.data?.token) {
      localStorage.clear();
      localStorage.setItem("tokenGithub", result.data.token);
      const userdata = await this.getGithubUser();

      return {
        token: result.data.token,
        user: userdata,
      };
    }

    return false;
  },

  async getGithubUser() {
    const token = localStorage.getItem("tokenGithub");
    if (token) {
      let endpoint = apiUrl + "/github-userdata/" + token;
      const result = await axios.get(endpoint);
      localStorage.setItem("loginGithub", result.data.userdata.login);
      localStorage.setItem("nameGithub", result.data.userdata.name);

      return {
        login: result.data.userdata.login,
        name: result.data.userdata.name,
      };
    }
    return false;
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

export default authService;
