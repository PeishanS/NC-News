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
        if(rows.length === 0){
            return Promise.reject({
                status: 404,
                msg: `No article found under article_id ${article_id}.`
            })
        }
        return rows[0];
    })
}

exports.selectArticles = () => {
    return db
    .query(
        `SELECT
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
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC;`
    )
    .then(({rows}) => {
        return rows;
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
    // username or body may be missing
    if(!username || !body){
        return Promise.reject({
            status: 400,
            msg:`Missing required information.`
        })
    };

    //check if the article_id exists
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
    if(typeof votes !== "number"){
        return Promise.reject({
            status:400,
            msg:"Invalid inc_votes format"
        })
    }
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
        console.log(rows, "<<<<<<")
        if(rows.length === 0){
            return Promise.reject({
                status: 404,
                msg: `No comments found under comment_id ${comment_id}.`
            })
        }
        return rows[0];
    })
}