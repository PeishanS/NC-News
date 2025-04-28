const db = require("./db/connection");
const express = require("express");
const app = express();
const endpointsJson = require("./endpoints.json");

const{ getApi } = require("./app/controllers/app.controller")

app.get("/api", getApi)

module.exports = app;