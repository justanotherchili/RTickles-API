const db = require("./db/connection");
const endpoints = require("./endpoints.json");

async function selectAllTopics() {
  try {
    const query = await db.query(`SELECT * FROM topics`);
    return query;
  } catch (err) {
    throw err;
  }
}

async function selectEndpoints() {
  try {
    return endpoints;
  } catch (err) {
    throw err;
  }
}

async function selectArticleByID(articleID) {
  try {
    const query = await db.query(
      `SELECT * FROM articles WHERE article_id = $1`,
      [articleID]
    );
    if (!query.rows[0]) {
      return Promise.reject({ status: 404, msg: "Article Does Not Exist!" });
    }
    return query.rows[0];
  } catch (err) {
    throw err;
  }
}

module.exports = { selectAllTopics, selectEndpoints, selectArticleByID };
