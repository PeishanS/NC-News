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
    .query(
        `SELECT articles.*,
        COUNT (comments.comment_id)::INT AS comment_count
        FROM articles 
        LEFT OUTER JOIN comments ON comments.article_id = articles.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id;`,
        [article_id])
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({
                status: 404,
                msg: `No article found under article_id ${article_id}.`
            })
        }
        return rows[0];
    })
}

exports.selectArticles = (sort_by = "created_at", order = "desc", topic ) => {
    const allowedSortBys = ["article_id", "title","topic", "author", "created_at", "votes", "article_img_url","comment_count"];

    const allowedOrders = ["asc", "desc"];

    if(!allowedSortBys.includes(sort_by)){
        return Promise.reject({
            status: 400,
            msg: `Invalid column query.`
        })
    };

    if(!allowedOrders.includes(order)){
        return Promise.reject({
            status: 400,
            msg: `Invalid order query.`
        })
    }

    const queryValues = [];

    let queryStr = `SELECT
        articles.author,
        articles.title,
        articles.article_id,
        articles.topic,
        articles.created_at,
        articles.votes,
        articles.article_img_url,
        COUNT(comments.comment_id)::INT AS comment_count
        FROM articles
        LEFT OUTER JOIN comments ON comments.article_id = articles.article_id
        `;
    
    if(topic){
        queryValues.push(topic);
        queryStr += "WHERE articles.topic = $1 ";
    }

    queryStr += `GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order.toUpperCase()};`

    return db
    .query(queryStr,queryValues)
    .then(({rows}) => {
        return rows;
    })
}

exports.checkIfTopicExists = (topic) => {
    return db
    .query(`SELECT * FROM topics WHERE slug = $1`, [topic])
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({
                status: 404,
                msg: `Topic not found.`
            })
        }
    })
}

exports.selectCommentsByArticleId = (article_id) => {
    return db
    .query(`SELECT * FROM articles WHERE article_id = $1`,[article_id])
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({
                status: 404,
                msg: `No article found under article_id ${article_id}.`
            })
        } else{
            return db
            .query(
                `SELECT 
                comments.comment_id,
                comments.votes,
                comments.created_at,
                comments.author,
                comments.body,
                comments.article_id
                FROM comments
                WHERE comments.article_id = $1
                ORDER BY created_at DESC`,
                [article_id]
            )
            .then(({rows}) => {
                return rows;
            })
        }
    })
}

exports.insertCommentByArticleId = (article_id, username, body) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({rows}) => {
        if(rows.length === 0){
            throw{
                status: 404,
                msg:`No article found under article_id ${article_id}.`
            }
        } else {
            return db.query(`
                INSERT INTO comments (article_id, author, body)
                VALUES ($1, $2, $3)
                RETURNING *;`, 
                [article_id, username, body])
            .then(({rows}) => {
                return rows[0]
            })
        }
    })
}

exports.updateArticleById = (article_id, {inc_votes: votes}) => {
    return db.query(
        `UPDATE articles
        SET
            votes = votes + $1
        WHERE article_id = $2
        RETURNING *;`,
        [votes, article_id]
    )
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({
                status: 404,
                msg:`No article found under article_id ${article_id}.`
            })
        }
        return rows[0];
    })
}

exports.removeCommentById = (comment_id) => {
    return db
    .query(
        `DELETE FROM comments
        WHERE comment_id = $1
        RETURNING *;`,
        [comment_id]
    )
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({
                status: 404,
                msg: `No comments found under comment_id ${comment_id}.`
            })
        }
        return rows[0];
    })
}

exports.selectUsers = () => {
    return db
    .query(
        `SELECT * FROM users`
    )
    .then(({rows}) => {
        return rows;
    })
}