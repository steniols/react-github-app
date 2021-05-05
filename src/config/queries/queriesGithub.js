const knex = require("./knex");

module.exports = {
  async getToken(token) {
    return knex("auth").where("token", token).first();
  },

  async saveToken(data) {
    const auth = await knex("auth").where("username", data.username).first();
    if (auth) {
      return knex("auth").where("username", data.username).update(data);
    }
    return knex("auth").insert(data);
  },

  async deleteToken(data) {
    return knex("auth")
      .where("token", data.token)
      .where("username", data.username)
      .del();
  },
  async getAllRepositories(user_id) {
    return knex("repositories")
      .select(
        "repositories.*",
        knex.raw("string_agg(tags.title, ',') as tags_desc"),
        knex.raw("string_agg(DISTINCT tags.id::text, ',') as tags_ids")
      )
      .leftJoin(
        "rel_tags_repository",
        "repositories.repository_id",
        "rel_tags_repository.repository_id"
      )
      .leftJoin("tags", "rel_tags_repository.tag_id", "tags.id")
      .where("repositories.user_id", user_id)
      .groupBy("repositories.id");
  },

  async saveRepository(data) {
    const repository = await knex("repositories")
      .where("repository_id", data.repository_id)
      .first();
    if (repository) {
      return knex("repositories")
        .where("repository_id", data.repository_id)
        .update(data);
    }
    return knex("repositories").insert(data);
  },

  async getOneReposity(id) {
    return knex("repositories")
      .select(
        "repositories.*",
        knex.raw("string_agg(tags.title, ',') as tags_desc"),
        knex.raw("string_agg(DISTINCT tags.id::text, ',') as tags_ids")
      )
      .leftJoin(
        "rel_tags_repository",
        "repositories.repository_id",
        "rel_tags_repository.repository_id"
      )
      .leftJoin("tags", "rel_tags_repository.tag_id", "tags.id")
      .where("repositories.repository_id", id)
      .groupBy("repositories.id")
      .first();
  },

  async removeTagsRepositoryRelationship(repository_id) {
    return knex("rel_tags_repository")
      .where("repository_id", repository_id)
      .del();
  },

  async saveTagsRepositoryRelationship(data) {
    return knex("rel_tags_repository").insert(data);
  },
};
