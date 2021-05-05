exports.up = function (knex) {
  return knex.schema.createTable("repositories", function (t) {
    t.increments("id").unsigned().primary();
    t.integer("repository_id").notNull();
    t.text("name").notNull();
    t.text("full_name").nullable();
    t.text("description").nullable();
    t.text("clone_url").nullable();
    t.text("html_url").nullable();
    t.integer("user_id").notNull();
    t.unique("repository_id");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("repositories");
};
