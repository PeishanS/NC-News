const endpointsJson = require("../../endpoints.json")
const { selectTopics, selectArticleById, selectArticles, selectCommentsByArticleId, insertCommentByArticleId, updateArticleById, removeCommentById, selectUsers, checkIfTopicExists } = require("../models/app.model")

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

exports.getArticles = (req, res,next) => {
    const {sort_by, order, topic } = req.query;

    if(topic){
        checkIfTopicExists(topic)
        .then(() => {
            return selectArticles(sort_by, order, topic)
        })
        .then((articles) => {
            res.status(200).send({articles})
        })
        .catch((err) => {
            next(err)
        })
    }else{
        return selectArticles(sort_by, order)
        .then((articles) => {
            res.status(200).send({articles})
        })
        .catch((err) => {
            next(err)
        })
    }
}

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    return selectCommentsByArticleId(article_id)
    .then((comments) => {
        res.status(200).send({comments})
    })
    .catch((err) => {
        next(err)
    })
}

exports.postCommentByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    const { username, body } = req.body;
    return insertCommentByArticleId(article_id, username, body)
    .then((insertComment) => {
        res.status(201).send({comment: insertComment})
    })
    .catch((err) => {
        next(err)
    })
}

exports.patchArticleById = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes: votes } =  req.body;
    return updateArticleById(article_id, { inc_votes: votes })
    .then((updatedArticle) => {
        res.status(200).send({article: updatedArticle})
    })
    .catch((err) => {
        next(err)
    })
}

exports.deleteCommentById = (req, res, next) => {
    const { comment_id } = req.params;
    return removeCommentById(comment_id)
    .then(() => {
        res.status(204).send()
    })
    .catch((err) => {
        next(err)
    })
}

exports.getUsers = (req, res, next) => {
    return selectUsers()
    .then((users) => {
        res.status(200).send({users})
    })
    .catch((err) => {
        next(err)
    }) 
}