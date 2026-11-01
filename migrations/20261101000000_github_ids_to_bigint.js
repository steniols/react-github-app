// GitHub ids are approaching the 32-bit integer limit, so store them as bigint
exports.up = async function (knex) {
  await knex.schema.alterTable("rel_tags_repository", (t) => {
    t.dropForeign("repository_id");
  });
  await knex.schema.alterTable("repositories", (t) => {
    t.bigInteger("repository_id").notNull().alter();
    t.bigInteger("user_id").notNull().alter();
  });
  await knex.schema.alterTable("rel_tags_repository", (t) => {
    t.bigInteger("repository_id").alter();
    t.foreign("repository_id").references("repository_id").inTable("repositories");
  });
  await knex.schema.alterTable("tags", (t) => {
    t.bigInteger("user_id").notNull().alter();
  });
};

exports.down = async function (knex) {
  await knex.schema.alterTable("rel_tags_repository", (t) => {
    t.dropForeign("repository_id");
  });
  await knex.schema.alterTable("repositories", (t) => {
    t.integer("repository_id").notNull().alter();
    t.integer("user_id").notNull().alter();
  });
  await knex.schema.alterTable("rel_tags_repository", (t) => {
    t.integer("repository_id").alter();
    t.foreign("repository_id").references("repository_id").inTable("repositories");
  });
  await knex.schema.alterTable("tags", (t) => {
    t.integer("user_id").notNull().alter();
  });
};
