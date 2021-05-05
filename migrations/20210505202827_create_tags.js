exports.up = function (knex) {
  return knex.schema.createTable("tags", function (t) {
    t.increments("id").unsigned().primary();
    t.text("title").notNull();
    t.text("content").nullable();
    t.text("image_url").nullable();
    t.integer("user_id").notNull();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("tags");
};
