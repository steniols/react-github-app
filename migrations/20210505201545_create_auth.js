exports.up = function (knex) {
  return knex.schema.createTable("auth", function (t) {
    t.increments("id").unsigned().primary();
    t.text("username").notNull();
    t.text("token").notNull();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("auth");
};
