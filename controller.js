const express = require("express");
const { selectAllTopics } = require("./model");

async function getAllTopics(req, res, next) {
  try {
    const topics = await selectAllTopics();
    res.status(200).send(topics.rows);
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllTopics };
