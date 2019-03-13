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

// export default app;