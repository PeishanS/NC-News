const db = require("../../db/connection");

exports.selectTopics = () => {
    return db
    .query(`SELECT topics.description, topics.slug FROM topics`)
    .then(({rows}) => {
        return rows;
    })
}

exports.selectArticleById = (article_id) => {
    return db
    .query(`SELECT * FROM articles WHERE article_id = $1`,[article_id])
    .then(({rows}) => {
        console.log(rows, "<<<<<<<<<<<<")
        if(rows.length === 0){
            return Promise.reject({
                status: 404,
                msg: `No article found under article_id ${article_id}.`
            })
        }
        return rows[0];
    })
}