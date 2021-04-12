import axios from "axios";

const apiUrl = "http://localhost:8000/api";

const tagsService = {
  async list() {
    const enpoint = apiUrl + "/tags";
    return axios.get(enpoint);
  },

  async getOne(tagId) {
    const enpoint = apiUrl + "/tags/" + tagId;
    return axios.get(enpoint);
  },

  async create(data) {
    const enpoint = apiUrl + "/tags";
    return axios.tag(enpoint, data);
  },

  async edit(data, tagId) {
    const enpoint = apiUrl + "/tags/" + tagId;
    return axios.put(enpoint, data);
  },

  async delete(tagId) {
    const enpoint = apiUrl + "/tags/" + tagId;
    return axios.delete(enpoint);
  },
};

export default tagsService;
