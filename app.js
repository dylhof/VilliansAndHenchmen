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
  const villain = request.body
  for (let requiredParam of ['name', 'movie', 'species']) {
    if(!villain[requiredParam]) {
      return response.status(422).send({error: `Sorry! We need a ${requiredParam} to post a villain`})
    }
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

app.post('/api/v1/henchmen', (request, response) => {
  const { name, species, villain_id } = request.body

  
  if (!name || !species || !villain_id) {
    return response.status(422).json(`Sorry! you need a name, species and villain id for this henchman!`)
  } 
  
  let villain 

  database('villain').where('id', villain_id)
    .then( foundVillain => villain = foundVillain)
  
  if(!villain) {
    return response.status(422).json(`A henchman can only exist if there is a villain to serve! ${villain}`)
  }

  database('henchmen')
    .returning('id')
    .insert({ name, species, villain_id })
    .then( id => {
      response.status(200).json(`Success! You posted a henchman with the id ${id}!`)
    })
    .catch(error => {
      response.status(500).json(`There has been an error posting the henchman: ${error}`)
    })
})

app.delete('/api/v1/henchmen/:id',(request, response) => {
  database('henchmen')
    .where('id', request.params.id)
    .select()
    .del()
    .then( () => {
      return response.sendStatus(204)
    })
    .catch(error => {
      return response.status(500).json({error: 'something went wrong'})
    })
})