const db = require("../../db/connection");

exports.selectTopics = () => {
    return db
    .query(`SELECT topics.description, topics.slug FROM topics`)
    .then(({rows}) => {
        return rows;
    })
}