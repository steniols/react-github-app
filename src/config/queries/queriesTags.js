const knex = require("./knex");

module.exports = {
  async getAll(user_id) {
    return knex("tags").where("user_id", user_id).orderBy("title");
  },

  async getOne(id, user_id) {
    return knex("tags").where({ id, user_id }).first();
  },

  async getIds(ids, user_id) {
    return knex("tags").whereIn("id", ids).where("user_id", user_id).pluck("id");
  },

  async create(data) {
    return knex("tags").insert(data, "*");
  },

  async update(id, user_id, data) {
    return knex("tags").where({ id, user_id }).update(data, "*");
  },

  async delete(id, user_id) {
    return knex.transaction(async (trx) => {
      const tag = await trx("tags").where({ id, user_id }).first();
      if (!tag) return 0;
      await trx("rel_tags_repository").where("tag_id", id).del();
      return trx("tags").where("id", id).del();
    });
  },
};
