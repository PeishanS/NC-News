const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data/index');

beforeAll(() => seed(data));
afterAll(() => db.end());

describe('seed', () => {
  describe('topics table', () => {
    test('topics table exists', () => {
      return db
        .query(
          `SELECT EXISTS (
            SELECT FROM 
                information_schema.tables 
            WHERE 
                table_name = 'topics'
            );`
        )
        .then(({ rows: [{ exists }] }) => {
          expect(exists).toBe(true);
        });
    });
    test('topics table has slug column as varying character', () => {
      return db
        .query(
          `SELECT *
            FROM information_schema.columns
            WHERE table_name = 'topics'
            AND column_name = 'slug';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe('slug');
          expect(column.data_type).toBe('character varying');
        });
    });
    test('topics table has slug column as the primary key', () => {
      return db
        .query(
          `SELECT column_name
            FROM information_schema.table_constraints AS tc
            JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            WHERE tc.constraint_type = 'PRIMARY KEY'
            AND tc.table_name = 'topics';`
        )
        .then(({ rows: [{ column_name }] }) => {
          expect(column_name).toBe('slug');
        });
    });
    test('topics table has description column as varying character', () => {
      return db
        .query(
          `SELECT column_name, data_type, column_default
            FROM information_schema.columns
            WHERE table_name = 'topics'
            AND column_name = 'description';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe('description');
          expect(column.data_type).toBe('character varying');
        });
    });
    test('topics table has img_url column of varying character of max length 1000', () => {
      return db
        .query(
          `SELECT column_name, data_type, character_maximum_length
            FROM information_schema.columns
            WHERE table_name = 'topics'
            AND column_name = 'img_url';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe('img_url');
          expect(column.data_type).toBe('character varying');
          expect(column.character_maximum_length).toBe(1000);
        });
    });
  });
  describe('users table', () => {
    test('users table exists', () => {
      return db
        .query(
          `SELECT EXISTS (
            SELECT FROM 
                information_schema.tables 
            WHERE 
                table_name = 'users'
            );`
        )
        .then(({ rows: [{ exists }] }) => {
          expect(exists).toBe(true);
        });
    });
    test('users table has username column of varying character', () => {
      return db
        .query(
          `SELECT column_name, data_type, column_default
            FROM information_schema.columns
            WHERE table_name = 'users'
            AND column_name = 'username';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe('username');
          expect(column.data_type).toBe('character varying');
        });
    });
    test('users table has username column as the primary key', () => {
      return db
        .query(
          `SELECT column_name
            FROM information_schema.table_constraints AS tc
            JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            WHERE tc.constraint_type = 'PRIMARY KEY'
            AND tc.table_name = 'users';`
        )
        .then(({ rows: [{ column_name }] }) => {
          expect(column_name).toBe('username');
        });
    });
    test('users table has name column as varying character', () => {
      return db
        .query(
          `SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'users'
            AND column_name = 'name';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe('name');
          expect(column.data_type).toBe('character varying');
        });
    });
    test('users table has avatar_url column of varying character of max length 1000', () => {
      return db
        .query(
          `SELECT column_name, character_maximum_length
            FROM information_schema.columns
            WHERE table_name = 'users'
            AND column_name = 'avatar_url';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe('avatar_url');
          expect(column.character_maximum_length).toBe(1000);
        });
    });
  });

  describe('articles table', () => {
    test('articles table exists', () => {
      return db
        .query(
          `SELECT EXISTS (
            SELECT FROM 
                information_schema.tables 
            WHERE 
                table_name = 'articles'
            );`
        )
        .then(({ rows: [{ exists }] }) => {
          expect(exists).toBe(true);
        });
    });
    test('articles table has article_id column as a serial', () => {
      return db
        .query(
          `SELECT column_name, data_type, column_default
            FROM information_schema.columns
            WHERE table_name = 'articles'
            AND column_name = 'article_id';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe('article_id');
          expect(column.data_type).toBe('integer');
          expect(column.column_default).toBe(
            "nextval('articles_article_id_seq'::regclass)"
          );
        });
    });
    test('articles table has article_id column as the primary key', () => {
      return db
        .query(
          `SELECT column_name
            FROM information_schema.table_constraints AS tc
            JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            WHERE tc.constraint_type = 'PRIMARY KEY'
            AND tc.table_name = 'articles';`
        )
        .then(({ rows: [{ column_name }] }) => {
          expect(column_name).toBe('article_id');
        });
    });
    test('articles table has title column as varying character', () => {
      return db
        .query(
          `SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'articles'
            AND column_name = 'title';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe('title');
          expect(column.data_type).toBe('character varying');
        });
    });
    test('articles table has topic column as varying character', () => {
      return db
        .query(
          `SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'articles'
            AND column_name = 'topic';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe('topic');
          expect(column.data_type).toBe('character varying');
        });
    });
    test("topic column references a slug from the topics table", () => {
      return db.query(`
        SELECT *
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
          AND tc.table_name = 'articles'
          AND kcu.column_name = 'topic'
          AND ccu.table_name = 'topics'
          AND ccu.column_name = 'slug';
        `)
        .then(({ rows }) => {
          expect(rows).toHaveLength(1); 
        });
    });
    test('articles table has author column as varying character', () => {
      return db
        .query(
          `SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'articles'
            AND column_name = 'author';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe('author');
          expect(column.data_type).toBe('character varying');
        });
    });
    test("author column references a username from the users table", () => {
      return db.query(`
        SELECT *
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
          AND tc.table_name = 'articles'
          AND kcu.column_name = 'author'
          AND ccu.table_name = 'users'
          AND ccu.column_name = 'username';
        `)
        .then(({ rows }) => {
          expect(rows).toHaveLength(1); 
      });
    });
    test('articles table has body column as text', () => {
      return db
        .query(
          `SELECT column_name, data_type, character_maximum_length
              FROM information_schema.columns
              WHERE table_name = 'articles'
              AND column_name = 'body';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe('body');
          expect(column.data_type).toBe('text');
        });
    });
    test('articles table has created_at column as timestamp', () => {
      return db
        .query(
          `SELECT column_name, data_type
              FROM information_schema.columns
              WHERE table_name = 'articles'
              AND column_name = 'created_at';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe('created_at');
          expect(column.data_type).toBe('timestamp without time zone');
        });
    });
    test('created_at column has default value of the current timestamp', () => {  //NEW
      return db.query(
        `SELECT column_default
        FROM information_schema.columns
        WHERE table_name = 'articles'
        AND column_name = 'created_at';`
      ).then(({ rows: [{ column_default}]}) => { 
        expect(column_default).toBe("CURRENT_TIMESTAMP")
      })
    })
    test('articles table has votes column as integer', () => {
      return db
        .query(
          `SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'articles'
            AND column_name = 'votes';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe('votes');
          expect(column.data_type).toBe('integer');
        });
    });
    test('votes column has default value of 0', () => { 
      return db.query(
        `SELECT column_default
          FROM information_schema.columns
          WHERE table_name = 'articles'
          AND column_name = 'votes'`
      ).then(({ rows: [{ column_default}]}) => { 
        expect(column_default).toBe("0")
      })
    })
    test('articles table has article_img_url column of varying character of max length 1000', () => {
      return db
        .query(
          `SELECT column_name, data_type, character_maximum_length
            FROM information_schema.columns
            WHERE table_name = 'articles'
            AND column_name = 'article_img_url';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe('article_img_url');
          expect(column.data_type).toBe('character varying');
          expect(column.character_maximum_length).toBe(1000);
        });
    });
  });

  describe('comments table', () => {
    test('comments table exists', () => {
      return db
        .query(
          `SELECT EXISTS (
            SELECT FROM 
                information_schema.tables 
            WHERE 
                table_name = 'comments'
            );`
        )
        .then(({ rows: [{ exists }] }) => {
          expect(exists).toBe(true);
        });
    });
    test('comments table has comment_id column as serial', () => {
      return db
        .query(
          `SELECT column_name, data_type, column_default
            FROM information_schema.columns
            WHERE table_name = 'comments'
            AND column_name = 'comment_id';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe('comment_id');
          expect(column.data_type).toBe('integer');
          expect(column.column_default).toBe(
            "nextval('comments_comment_id_seq'::regclass)"
          );
        });
    });
    test('comments table has comment_id column as the primary key', () => {
      return db
        .query(
          `SELECT column_name
            FROM information_schema.table_constraints AS tc
            JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            WHERE tc.constraint_type = 'PRIMARY KEY'
            AND tc.table_name = 'comments';`
        )
        .then(({ rows: [{ column_name }] }) => {
          expect(column_name).toBe('comment_id');
        });
    });
    test('comments table has article_id column as integer', () => {
      return db
        .query(
          `SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'comments'
            AND column_name = 'article_id';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe('article_id');
          expect(column.data_type).toBe('integer');
        });
    });
    test("article_id is foreign key referencing an article from the articles table", () => { // NEW
      return db.query(
          `SELECT DISTINCT article_id 
            FROM comments 
            WHERE article_id IS NOT NULL  
            AND article_id NOT IN (SELECT article_id FROM articles);`
        )
        .then(({ rows }) => {
          expect(rows).toHaveLength(0); 
        });
    });
    
    test('comments table has body column as text', () => {
      return db
        .query(
          `SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'comments'
            AND column_name = 'body';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe('body');
          expect(column.data_type).toBe('text');
        });
    });
    test('comments table has votes column as integer', () => {
      return db
        .query(
          `SELECT column_name, data_type
              FROM information_schema.columns
              WHERE table_name = 'comments'
              AND column_name = 'votes';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe('votes');
          expect(column.data_type).toBe('integer');
        });
    });
    test('votes column has default value of 0', () => { 
      return db.query(
        `SELECT column_default
          FROM information_schema.columns
          WHERE table_name = 'comments'
          AND column_name = 'votes'`
        ).then(({ rows: [{ column_default}]}) => { 
        expect(column_default).toBe("0")
      })
    })

    test('comments table has author column as varying character', () => {
      return db
        .query(
          `SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'comments'
            AND column_name = 'author';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe('author');
          expect(column.data_type).toBe('character varying');
      });
    });
    test("author column references a username from the users table", () => { //NEW 
      return db
        .query(
          `SELECT DISTINCT author 
          FROM comments
          WHERE author IS NOT NULL 
          AND author NOT IN (SELECT username FROM users);`
        )
        .then(({ rows }) => {
          expect(rows).toHaveLength(0); // No articles should have a topic not found in topics
        });
    });
    test('comments table has created_at column as timestamp', () => {
      return db
        .query(
          `SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'comments'
            AND column_name = 'created_at';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe('created_at');
          expect(column.data_type).toBe('timestamp without time zone');
        });
    });
     test('created_at column has default value of the current timestamp', () => {  //NEW
      return db.query(
        `SELECT column_default
        FROM information_schema.columns
        WHERE table_name = 'comments'
        AND column_name = 'created_at';`
      ).then(({ rows: [{ column_default}]}) => { 
        expect(column_default).toBe("CURRENT_TIMESTAMP")
      })
    })
  });

  describe('data insertion', () => {
    test('topics data has been inserted correctly', () => {
      return db.query(`SELECT * FROM topics;`).then(({ rows: topics }) => {
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(typeof topic.slug).toBe('string');
          expect(typeof topic.description).toBe('string');
          expect(typeof topic.img_url).toBe('string');
        });
      });
    });
    test('users data has been inserted correctly', () => {
      return db.query(`SELECT * FROM users;`).then(({ rows: users }) => {
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(typeof user.username).toBe('string');
          expect(typeof user.name).toBe('string');
          expect(typeof user.avatar_url).toBe('string');
        });
      });
    });
    test('articles data has been inserted correctly', () => {
      return db.query(`SELECT * FROM articles;`).then(({ rows: articles }) => {
        expect(articles).toHaveLength(13);
        articles.forEach((article) => {
          expect(typeof article.article_id).toBe('number');
          expect(typeof article.title).toBe('string');
          expect(typeof article.topic).toBe('string');
          expect(typeof article.author).toBe('string');
          expect(typeof article.body).toBe('string');
          expect(typeof article.created_at).toBe('object');
          expect(typeof article.votes).toBe('number');
          expect(typeof article.article_img_url).toBe('string');
        });
      });
    });
    test('comments data has been inserted correctly', () => {
      return db.query(`SELECT * FROM comments;`).then(({ rows: comments }) => {
        expect(comments).toHaveLength(18);
        comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe('number');
          expect(typeof comment.body).toBe('string');
          expect(typeof comment.article_id).toBe('number');
          expect(typeof comment.author).toBe('string');
          expect(typeof comment.votes).toBe('number');
          expect(typeof comment.created_at).toBe('object');
        });
      });
    });
  });
});
