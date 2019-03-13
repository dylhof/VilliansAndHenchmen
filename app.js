const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

const express = require('express');
const app = express()
module.exports = app
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Welcome to Disney Villains and Henchmen') 
})

app.get('/api/v1/villains', (request, response) => {
  database('villains').select()
    .then((villains)=> {
      response.status(200).json(villains);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/henchmen', (request, response) => {
  database('henchmen').select()
    .then((henchmen) => {
      response.status(200).json(henchmen)
    })
    .catch((error) => {
      response.status(500).json({ error })
    })
})

app.get('/api/v1/villains/:id', (request, response) => {
  database('villains').where('id', request.params.id).select()
    .then(villain => {
      if (villain.length) {
        response.status(200).json(villain)
      } else {
        response.status(404).json(
          `Could not find a villain with the id ${request.params.id}`
        )
      }
    })
    .catch(error => {
      response.status(500).json({ error })
    })
})

app.get('/api/v1/henchmen/:id', (request, response) => {
  database('henchmen').where('id', request.params.id).select()
    .then(henchman => {
      if (henchman.length) {
        response.status(200).json(henchman)
      } else {
        response.status(400).json(
          `Could not find a henchman with the id ${request.params.id}`
        )
      }
    })
    .catch(error => {
      response.status(500).json({ error })
    })
})

app.post('/api/v1/villains', (request, response) => {
  const { name, movie, species } = request.body

  if (!name) {
    return response.status(422).json('Sorry! We can not post a villain without a name!')
  } else if (!movie) {
    return response.status(422).json('Sorry! We can not post a villain without a movie!')
  } else if (!species) {
    return response.status(422).json('Sorry! We can not post a villain without a species!')
  }

  database('villains')
    .returning('id')
    .insert({name, movie, species})
    .then( id => {
      response.status(200).json(`Mua ha ha! Sucess! Your villain has been posted with the id ${id}`)
    })
    .catch(error => {
      response.status(500).json(`There has been an error posting your villain: ${error}`)
    })
})