import axios from "axios";
import env from "react-dotenv";

const apiUrl = env.API_URL + "/tags";

const tagsService = {
  async list() {
    const endpoint = apiUrl;
    const data = {
      token: localStorage.getItem("tokenGithub"),
    };
    return axios.post(endpoint, data);
  },

  async getOne(tagId) {
    const endpoint = apiUrl + "/" + tagId;
    return axios.get(endpoint);
  },

  async create(data) {
    const endpoint = apiUrl + "/save";
    return axios.post(endpoint, data);
  },

  async edit(data, tagId) {
    const endpoint = apiUrl + "/save/" + tagId;
    return axios.put(endpoint, data);
  },

  async delete(tagId) {
    const endpoint = apiUrl + "/" + tagId;
    return axios.delete(endpoint);
  },
};

export default tagsService;
