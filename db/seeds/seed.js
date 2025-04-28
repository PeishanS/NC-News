const db = require("../connection");
const format = require("pg-format");
const { convertTimestampToDate, createRef } = require("./utils")

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db.query(`DROP TABLE IF EXISTS comments;`)
  .then(() => {
    return db.query(`DROP TABLE IF EXISTS articles;`);
  })
  .then(() => {
    return db.query(`DROP TABLE IF EXISTS users;`);
  })
  .then(() => {
    return db.query(`DROP TABLE IF EXISTS topics;`);
  })
  .then(() => {
    return db.query(`CREATE TABLE topics(
      slug VARCHAR(100) PRIMARY KEY NOT NULL,
      description VARCHAR(1000),
      img_url VARCHAR(1000)
      );`)
  })
  .then(() => {
    return db.query(`CREATE TABLE users(
      username VARCHAR(100) PRIMARY KEY NOT NULL,
      name VARCHAR(100),
      avatar_url VARCHAR(1000)
      );`)
  })
  .then(() => {
    return db.query(`CREATE TABLE articles(
      article_id SERIAL PRIMARY KEY NOT NULL,
      title VARCHAR(300),
      topic VARCHAR(100),
      author VARCHAR(100),
      body TEXT,
      created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      votes INT DEFAULT 0,
      article_img_url VARCHAR(1000),
      FOREIGN KEY (topic) REFERENCES topics(slug),
      FOREIGN KEY (author) REFERENCES users(username)
      );`)
  })
  .then(() => {
    return db.query(`CREATE TABLE comments(
      comment_id SERIAL PRIMARY KEY NOT NULL,
      article_id INT,
      body TEXT,
      votes INT DEFAULT 0,
      author VARCHAR(100),
      created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (article_id) REFERENCES articles(article_id),
      FOREIGN KEY (author) REFERENCES users(username)
      );`)
  })
  .then(() => {
    const formattedTopics = topicData.map((topic) => {
      return [
        topic.description,
        topic.slug,
        topic.img_url
      ];
    }) 
    const insertedTopicQuery = format(
      `INSERT INTO topics(description, slug, img_url)
      VALUES %L RETURNING *;`,
      formattedTopics
    )
    return db.query(insertedTopicQuery);
  })
  .then(() => {
    const formattedUsers = userData.map((user) => {
      return [
        user.username,
        user.name,
        user.avatar_url
      ];
    })
    const insertedUserQuery = format(
      `INSERT INTO users(username, name, avatar_url)
      VALUES %L RETURNING *;`,
      formattedUsers
    )
    return db.query(insertedUserQuery);
  })
  .then(() => {
      const formattedArticles = articleData.map((article) => {
      const legitArticle = convertTimestampToDate(article);
      return [
        legitArticle.title,
        legitArticle.topic,
        legitArticle.author,
        legitArticle.body,
        legitArticle.created_at,
        legitArticle.votes,
        legitArticle.article_img_url
      ]
    })
    const insertedArticleQuery = format(
      `INSERT INTO articles (title, topic, author, body, created_at, votes,article_img_url)
      VALUES %L RETURNING *;`,
      formattedArticles
    )
    return db.query(insertedArticleQuery);
  })
  .then((result) => {
      const formattedComments = commentData.map((comment) => {
      const legitComment = convertTimestampToDate(comment);
      const articleRefObj = createRef(result.rows)
      return [
        articleRefObj[comment.article_title],
        legitComment.body,
        legitComment.votes,
        legitComment.author,
        legitComment.created_at,
      ]
    })
    const insertedCommentQuery = format(
      `INSERT INTO comments (article_id, body, votes, author, created_at) 
      VALUES %L RETURNING *;`,
      formattedComments
    )
    return db.query(insertedCommentQuery);
  })
  .then(() => {
    console.log("Seed complete.")
  })
};
module.exports = seed;