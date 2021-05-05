exports.up = function (knex) {
  return knex.schema.createTable("rel_tags_repository", function (t) {
    t.integer("tag_id")
      .notNull()
      .unsigned()
      .index()
      .references("id")
      .inTable("tags");
    t.integer("repository_id")
      .unsigned()
      .index()
      .references("repository_id")
      .inTable("repositories");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("rel_tags_repository");
};
