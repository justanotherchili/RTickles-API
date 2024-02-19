const express = require("express");
const { selectAllTopics, selectEndpoints } = require("./model");

async function getAllTopics(req, res, next) {
  try {
    const topics = await selectAllTopics();
    res.status(200).send(topics.rows);
  } catch (err) {
    next(err);
  }
}

async function getAllEndpoints(req, res, next){
  try{
    const endPoints = await selectEndpoints()
    res.status(200).send(endPoints)
  }
  catch(err){
    next(err)
  }
}

module.exports = { getAllTopics,getAllEndpoints };
