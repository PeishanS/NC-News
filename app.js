const db = require("./db/connection");
const express = require("express");
const app = express();
const endpointsJson = require("./endpoints.json");

const{ getApi, getTopics, getArticleById } = require("./app/controllers/app.controller")

app.get("/api", getApi)

app.get("/api/topics", getTopics)

app.get("/api/articles/:article_id", getArticleById)


app.use((err, req, res, next) => {
    if(err.status && err.msg){
        res.status(err.status).send({msg: err.msg})
    }
    else{
        next(err);
    }
});

app.use((err, req, res, next) => {
    if(err.code === "22P02"){
        res.status(400).send({msg: "Bad request."})
    }
});

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send({msg:"Internal Server Erros"})
});


module.exports = app;