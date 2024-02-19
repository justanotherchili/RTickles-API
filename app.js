const express = require('express')
const { getAllTopics, getAllEndpoints } = require('./controller')
const app = express()

app.get('/api/topics', getAllTopics)

app.get('/api', getAllEndpoints)

app.all(('/*'), (req, res, next) => {
  res.status(404).send({msg: 'Path Not Found'})
  next(err)
})

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app