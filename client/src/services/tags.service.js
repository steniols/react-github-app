import api from "./api";

const tagsService = {
  async list() {
    return api.get("/tags");
  },

  async getOne(tagId) {
    return api.get(`/tags/${tagId}`);
  },

  async create(data) {
    return api.post("/tags/save", data);
  },

  async edit(data, tagId) {
    return api.put(`/tags/save/${tagId}`, data);
  },

  async delete(tagId) {
    return api.delete(`/tags/${tagId}`);
  },
};

export default tagsService;
