import axios from "axios";
import env from "react-dotenv";

const apiUrl = env.API_URL ? `${env.API_URL}/tags` : "/tags";

const tagsService = {
  async list() {
    const url = apiUrl;
    const data = {
      token: localStorage.getItem("tokenGithub"),
    };
    return axios.post(url, data);
  },

  async getOne(tagId) {
    const url = `${apiUrl}/${tagId}`;
    return axios.get(url);
  },

  async create(data) {
    const url = `${apiUrl}/save`;
    return axios.post(url, data);
  },

  async edit(data, tagId) {
    const url = `${apiUrl}/save/${tagId}`;
    return axios.put(url, data);
  },

  async delete(tagId) {
    const url = `${apiUrl}/${tagId}`;
    return axios.delete(url);
  },
};

export default tagsService;
