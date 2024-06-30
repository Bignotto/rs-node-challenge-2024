import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("meals", (table) => {
    table.increments("id").primary();
    table.text("description").notNullable();
    table.text("title").notNullable();
    table.dateTime("date_time").notNullable();
    table.boolean("on_diet").notNullable();
    table.text("user_id").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("meals");
}
