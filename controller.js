const express = require("express");
const {
  selectAllTopics,
  selectEndpoints,
  selectArticleByID,
  selectAllArticles,
  selectCommentsByArticleID,
  insertCommentsByArticleID,
  updateVotesByArticleID,
  deleteCommentsByID,
  selectAllUsers,
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
    const topic = req.query.topic
    const articles = await selectAllArticles(topic);
    res.status(200).send({articles});
  } catch (err) {
    next(err);
  }
}

async function getCommentsByArticleID(req, res, next) {
  try {
    const article_id = req.params.article_id;
    const article = await selectArticleByID(article_id);
    const comments = await selectCommentsByArticleID(article_id);

    res.status(200).send(comments);
  } catch (err) {
    next(err);
  }
}

async function postCommentsByArticleID(req, res, next) {
  try {
    const article_id = req.params.article_id;
    const { username, body } = req.body;
    const postComment = await insertCommentsByArticleID(
      article_id,
      username,
      body
    );
    res.status(201).send({ comment: postComment });
  } catch (err) {
    next(err);
  }
}

async function patchVotesByArticleID(req, res, next) {
  try {
    const article_id = req.params.article_id;
    const newVote = req.body.inc_votes;
    const validArticle = await selectArticleByID(article_id);
    const patchVote = await updateVotesByArticleID(newVote, article_id);
    res.status(200).send(patchVote);
  } catch (err) {
    next(err);
  }
}

async function removeCommentByID(req, res, next) {
  try {
    const commentID = req.params.comment_id;
    const deleteComment = await deleteCommentsByID(commentID);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function getAllUsers(req, res, next){
  try{
    const allUsers = await selectAllUsers()
    res.status(200).send({users: allUsers})
  }
  catch(err){
    next(err)
  }
}


module.exports = {
  getAllTopics,
  getAllEndpoints,
  getArticleByID,
  getAllArticles,
  getCommentsByArticleID,
  postCommentsByArticleID,
  patchVotesByArticleID,
  removeCommentByID,
  getAllUsers
};
