const knex = require("./knex");

module.exports = {
  async getAll(user_id, search = false) {
    let query = knex("tags").where("user_id", user_id);
    if (search) {
      query.where(function () {
        this.where("tags.title", search.trim());
      });
    }
    return query;
  },

  async getOne(id) {
    return knex("tags").where("id", id).first();
  },

  async create(data) {
    return knex("tags").insert(data, "*");
  },

  async update(id, data) {
    return knex("tags").where("id", id).update(data, "*");
  },

  async delete(id) {
    return knex("tags").where("id", id).del();
  },
};
