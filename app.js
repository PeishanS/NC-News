const db = require("./db/connection");
const express = require("express");
const app = express();
const endpointsJson = require("./endpoints.json");

const{ getApi, getTopics } = require("./app/controllers/app.controller")

app.get("/api", getApi)

app.get("/api/topics", getTopics)

module.exports = app;