const db = require('./db/connection')
const endpoints = require('./endpoints.json')


async function selectAllTopics(){
  try{
    const query = await db.query(`SELECT * FROM topics`)
    return query
  }
  catch(err){
    throw err
  }
}

async function selectEndpoints(){
  try{
    return endpoints
  }
  catch(err){
    throw err
  }
}

module.exports = {selectAllTopics, selectEndpoints}