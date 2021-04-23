import axios from "axios";
import env from "react-dotenv";

const apiUrl = env.API_URL;

const tagsService = {
  async list() {
    const enpoint = apiUrl + "/tags";
    const data = {
      token: localStorage.getItem("tokenGithub"),
    };
    return axios.post(enpoint, data);
  },

  async getOne(tagId) {
    const enpoint = apiUrl + "/tags/" + tagId;
    return axios.get(enpoint);
  },

  async create(data) {
    const enpoint = apiUrl + "/tags/save";
    return axios.post(enpoint, data);
  },

  async edit(data, tagId) {
    const enpoint = apiUrl + "/tags/save/" + tagId;
    return axios.put(enpoint, data);
  },

  async delete(tagId) {
    const enpoint = apiUrl + "/tags/" + tagId;
    return axios.delete(enpoint);
  },
};

export default tagsService;
