const express = require("express");
const {
  getAllTopics,
  getAllEndpoints,
  getArticleByID,
  getAllArticles,
  getCommentsByArticleID,
} = require("./controller");
const app = express();

app.get("/api/topics", getAllTopics);

app.get("/api", getAllEndpoints);

app.get("/api/articles/:article_id", getArticleByID);

app.get("/api/articles", getAllArticles)

app.get("/api/articles/:article_id/comments", getCommentsByArticleID)

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "Path Not Found" });
  next(err);
});

app.use((err, req, res, next) => {
  const errorCodes = ["22P02"];
  if (errorCodes.includes(err.code))
    res.status(400).send({ msg: "Bad Request" });
  next(err);
});

app.use((err, req, res, next) => {
  if (err.status === 404) res.status(404).send(err.msg);
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
