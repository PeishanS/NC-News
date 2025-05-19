const db = require("./db/connection");
const express = require("express");
const cors = require("cors");
const app = express();
const endpointsJson = require("./endpoints.json");

const { getApi, getTopics, getArticleById, getArticles, getCommentsByArticleId, postCommentByArticleId, patchArticleById, deleteCommentById, getUsers } = require("./app/controllers/app.controller")

app.use(cors());

app.use(express.json());

app.get("/api", getApi)

app.get("/api/topics", getTopics)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id/comments", getCommentsByArticleId)

app.post("/api/articles/:article_id/comments", postCommentByArticleId)

app.patch("/api/articles/:article_id", patchArticleById)

app.delete("/api/comments/:comment_id", deleteCommentById)

app.get("/api/users", getUsers)

app.all("/*splat", (req, res) => {
    res.status(404).send({msg:"Path not found."})
})

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