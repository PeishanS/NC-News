const endpointsJson = require("../../endpoints.json")
const { selectTopics, selectArticleById, selectArticles} = require("../models/app.model")

exports.getApi = (req, res) => {
    res.status(200).json({endpoints: endpointsJson})
}

exports.getTopics = (req, res) => {
    return selectTopics()
    .then((topics) => {
        res.status(200).send({topics})
    })
}

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params; 
    return selectArticleById(article_id)
    .then((article) => {
        res.status(200).send({article})
    })
    .catch((err) => {
        next(err)
    })
}

exports.getArticles = (req, res) => {
    return selectArticles()
    .then((articles) => {
        res.status(200).send({articles})
    })
}