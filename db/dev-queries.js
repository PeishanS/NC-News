const db = require("./connection");

async function runQueries(){
    try{
        //Get all of the users
        const users = await db.query(`SELECT * FROM users;`);
        console.log("All users: ", users.rows)

        //Get all of the articles where the topic is coding
        const allCodingArticles = await db.query(
            `SELECT * FROM articles WHERE topic = 'coding';`
        );
        console.log("All coding articles: ", allCodingArticles.rows)

        //Get all of the comments where the votes are less than zero
        const negativeVotesComments = await db.query(
            `SELECT * FROM comments WHERE votes < 0;`
        );
        console.log("All negative votes comments: ", negativeVotesComments.rows)

        // Get all of the topics
        const topics = await db.query( `SELECT * FROM topics;`)
        console.log("All topics: ", topics.rows)

        // Get all of the articles by user grumpy19
        const grumptyArticles = await db.query(
            `SELECT * FROM articles WHERE author = 'grumpy19';`
        );
        console.log("Articles by grumpy19: ", grumptyArticles.rows)

        // Get all of the comments that have more than 10 votes
        const tenPlusVotesComments = await db.query(
            `SELECT * FROM comments WHERE votes > 10;`
        );
        console.log("Comments with votes > 10: ", tenPlusVotesComments)
    }
    catch(err){
        console.log(err)
    }
    finally{
    db.end();
    }
};

runQueries();
