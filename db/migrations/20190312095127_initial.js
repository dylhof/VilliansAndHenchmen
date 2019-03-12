
exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('villains', (table) => {
      table.increments('id').primary();
      table.string('name');
      table.string('movie');
      table.string('species');
      table.timestamps(true, true);
    }),
    knex.schema.createTable('henchmen', (table) => {
      table.increments('id').primary();
      table.string('name');
      table.string('species');
      table.integer('villain_id').unsigned();
      table.foreign('villain_id').references('villains.id');
      table.timestamps(true, true);
    })
  ])
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable('villains'),
    knex.schema.dropTable('henchmen')
  ])
};
