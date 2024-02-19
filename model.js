const db = require('./db/connection')

async function selectAllTopics(){
  try{
    const query = await db.query(`SELECT * FROM topics`)
    return query
  }
  catch(err){
    throw err
  }
}

module.exports = {selectAllTopics}