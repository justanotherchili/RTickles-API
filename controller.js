const express = require("express");
const {
  selectAllTopics,
  selectEndpoints,
  selectArticleByID,
  selectAllArticles,
  selectCommentsByArticleID,
} = require("./model");

async function getAllTopics(req, res, next) {
  try {
    const topics = await selectAllTopics();
    res.status(200).send(topics);
  } catch (err) {
    next(err);
  }
}

async function getAllEndpoints(req, res, next) {
  try {
    const endPoints = await selectEndpoints();
    res.status(200).send(endPoints);
  } catch (err) {
    next(err);
  }
}

async function getArticleByID(req, res, next) {
  try {
    const articleID = req.params.article_id;
    const article = await selectArticleByID(articleID);
    res.status(200).send(article);
  } catch (err) {
    next(err);
  }
}

async function getAllArticles(req, res, next) {
  try {
    const articles = await selectAllArticles();
    res.status(200).send(articles);
  } catch (err) {
    next(err);
  }
}

async function getCommentsByArticleID(req, res, next) {
  try {
    const article_id = req.params.article_id;
    const article = await selectArticleByID(article_id)
    const comments = await selectCommentsByArticleID(article_id);

    res.status(200).send(comments);
  } catch (err) {
    next(err);
  }
}
module.exports = {
  getAllTopics,
  getAllEndpoints,
  getArticleByID,
  getAllArticles,
  getCommentsByArticleID,
};
