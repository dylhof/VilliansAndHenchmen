const villains = require('../../../villains')

const createVillain = (knex, villain) => {
  return knex('villains').insert({
    name: villain.name,
    movie: villain.movie,
    species: villain.species
  }, 'id')
  .then(villainId => {
    let hechmenPromises = [];
    villain.henchmen.forEach(henchman => {
      hechmenPromises.push(
        createHenchman(knex, {
          name: henchman.name,
          species: henchman.species,
          villain_id: villainId[0]
        })
      )
    });
    return Promise.all(hechmenPromises);
  })
};

const createHenchman = (knex, henchman) => {
  return knex('henchmen').insert(henchman);
};


exports.seed = (knex, Promise) => {
  return knex('henchmen').del()
    .then(() => knex('villains').del())
    .then(() => {
      let villainPromises = [];
      villains.forEach(villain => {
        villainPromises.push(createVillain(knex, villain))
      });
      return Promise.all(villainPromises);
    })
    .catch(error => console.log(`Error seeding Data: ${error}`))
};
