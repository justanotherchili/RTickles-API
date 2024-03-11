const express = require("express");
const {
  getAllTopics,
  getAllEndpoints,
  getArticleByID,
  getAllArticles,
  getCommentsByArticleID,
  postCommentsByArticleID,
  patchVotesByArticleID,
  removeCommentByID,
  getAllUsers,
} = require("./controller");
const cors = require('cors')
const app = express();
app.use(cors())
app.use(express.json());

app.get("/api/topics", getAllTopics);

app.get("/api", getAllEndpoints);

app.get("/api/articles/:article_id", getArticleByID);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleID);

app.post("/api/articles/:article_id/comments", postCommentsByArticleID);

app.patch("/api/articles/:article_id", patchVotesByArticleID)

app.delete("/api/comments/:comment_id", removeCommentByID)

app.get("/api/users", getAllUsers)

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "Path Not Found" });
  next(err);
});

app.use((err, req, res, next) => {
  const errorMsg = {
    "22P02": "Invalid Input Type",
    "23503": "Non-Existent ID Value",
    "23502": "Missing Required Field Values",
  };
  if (errorMsg[err.code] !== undefined)
    res.status(400).send({ msg: `Bad Request. ${errorMsg[err.code]}` });
  next(err);
});

app.use((err, req, res, next) => {
  if (err.status === 404) res.status(404).send({msg:err.msg});
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
