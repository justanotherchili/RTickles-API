const db = require("./db/connection");
const endpoints = require("./endpoints.json");

async function selectAllTopics() {
  try {
    const query = await db.query(`SELECT * FROM topics`);
    return query.rows;
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
    if (query.rowCount === 0) {
      return Promise.reject({ status: 404, msg: "Article Not Found" });
    }
    return query.rows[0];
  } catch (err) {
    throw err;
  }
}

async function selectAllArticles(topic) {
  try {
    const queries = [];
    let sqlString = `
    SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
      (SELECT COUNT(*) FROM comments WHERE comments.article_id = articles.article_id)::integer AS comment_count
    FROM articles`;
    if (topic) {
      sqlString += " WHERE topic = $1";
      queries.push(topic);
    }
    sqlString += ` ORDER BY created_at desc`;
    const query = await db.query(sqlString, queries);
    if(query.rowCount === 0){
      return Promise.reject({status: 404, msg: 'Topic Not Found'})
    }
    return query.rows;
  } catch (err) {
    throw err;
  }
}

async function selectCommentsByArticleID(article_id) {
  try {
    const query = await db.query(
      `
      SELECT * FROM comments 
      WHERE article_id = $1 
      ORDER BY created_at DESC`,
      [article_id]
    );
    return query.rows;
  } catch (err) {
    throw err;
  }
}

async function insertCommentsByArticleID(article_id, author, body) {
  try {
    const query = await db.query(
      `
      INSERT INTO comments(body, author, article_id) 
      VALUES ($1, $2, $3) 
      RETURNING *`,
      [body, author, article_id]
    );
    return query.rows[0];
  } catch (err) {
    throw err;
  }
}

async function updateVotesByArticleID(newVote, article_id) {
  try {
    const query = await db.query(
      `
      UPDATE articles
      SET votes = votes + $1 
      WHERE article_id = $2
      RETURNING *`,
      [newVote, article_id]
    );
    return query.rows[0];
  } catch (err) {
    throw err;
  }
}

async function deleteCommentsByID(commentID) {
  try {
    const query = await db.query(
      `
    DELETE from comments
    WHERE comment_id = $1
    RETURNING *
    `,
      [commentID]
    );
    if (query.rowCount === 0) {
      return Promise.reject({ status: 404, msg: "Comment Not Found" });
    }
    return query;
  } catch (err) {
    throw err;
  }
}

async function selectAllUsers() {
  try {
    const query = await db.query(`
    SELECT * FROM users
    `);
    return query.rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

module.exports = {
  selectAllTopics,
  selectEndpoints,
  selectArticleByID,
  selectAllArticles,
  selectCommentsByArticleID,
  insertCommentsByArticleID,
  updateVotesByArticleID,
  deleteCommentsByID,
  selectAllUsers,
};
