const knex = require("./knex");

function repositoriesWithTags() {
  return knex("repositories")
    .select(
      "repositories.*",
      knex.raw("string_agg(tags.title, ',' ORDER BY tags.title) as tags_desc"),
      knex.raw("string_agg(tags.id::text, ',') as tags_ids")
    )
    .leftJoin(
      "rel_tags_repository",
      "repositories.repository_id",
      "rel_tags_repository.repository_id"
    )
    .leftJoin("tags", "rel_tags_repository.tag_id", "tags.id")
    .groupBy("repositories.id");
}

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
    return knex("auth").where("token", data.token).del();
  },

  async getAllRepositories(user_id, search = false) {
    const query = repositoriesWithTags()
      .where("repositories.user_id", user_id)
      .orderBy("repositories.name");

    if (search) {
      const term = `%${search.trim()}%`;
      // Search in a subquery so the matched repositories still show all their tags
      query.whereIn("repositories.repository_id", function () {
        this.select("r.repository_id")
          .from("repositories as r")
          .leftJoin("rel_tags_repository as rt", "r.repository_id", "rt.repository_id")
          .leftJoin("tags as t", "rt.tag_id", "t.id")
          .where("r.user_id", user_id)
          .where(function () {
            this.where("r.name", "ilike", term)
              .orWhere("r.description", "ilike", term)
              .orWhere("t.title", "ilike", term)
              .orWhere("t.content", "ilike", term);
          });
      });
    }

    return query;
  },

  async saveRepository(data) {
    return knex("repositories")
      .insert(data)
      .onConflict("repository_id")
      .merge();
  },

  async getOneRepository(repository_id, user_id) {
    return repositoriesWithTags()
      .where("repositories.repository_id", repository_id)
      .where("repositories.user_id", user_id)
      .first();
  },

  async setRepositoryTags(repository_id, tag_ids) {
    return knex.transaction(async (trx) => {
      await trx("rel_tags_repository").where("repository_id", repository_id).del();
      if (tag_ids.length) {
        await trx("rel_tags_repository").insert(
          tag_ids.map((tag_id) => ({ repository_id, tag_id }))
        );
      }
    });
  },
};
