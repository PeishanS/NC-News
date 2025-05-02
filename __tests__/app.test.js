const endpointsJson = require("../endpoints.json");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const request = require("supertest");
const app = require("../app")

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("status 200 - responds with the requested array containing all of the topics", () => {
    return request(app)
    .get("/api/topics")
    .expect(200)
    .then(({body}) => {
      expect(body.topics).toHaveLength(3);
      body.topics.forEach((topic) => {
        expect(typeof topic.description).toBe("string");
        expect(typeof topic.slug).toBe("string");
        expect(topic).not.toHaveProperty("img_url");
      })
    })
  })
});

describe("GET /api/articles/:article_id", () => {
  test("status 200 - responds with the requested article by id", () => {
    return request(app)
    .get("/api/articles/1")
    .expect(200)
    .then(({body}) => {
      expect(body.article).toMatchObject(
        {
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: '2020-07-09T20:11:00.000Z',
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        }
      )
    })
  })
  test("status 404 - when passed a valid id but doesn't exist", () => {
    return request(app)
    .get("/api/articles/999")
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe("No article found under article_id 999.")
    })
  })
  test("staus 400 - when passed an invalid id", () => {
    return request(app)
    .get("/api/articles/apple")
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("Bad request.")
    })
  })
});

describe("GET /api/articles/:article_id (comment_count)", () => {
  test("status 200 - responds with the requested article by id with feather of comment_count", () => {
    return request(app)
    .get("/api/articles/1")
    .expect(200)
    .then(({body}) => {
      expect(body.article).toMatchObject(
        {
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: '2020-07-09T20:11:00.000Z',
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count:11
        }
      )
    })
  })
})

describe("GET /api/articles", () => {
  test("status:200 - responds with all the articles sorted by date in descending order", () => {
    return request(app)
    .get("/api/articles")
    .then(({body}) => {
      expect(body.articles).toHaveLength(13);
      expect(body.articles).toBeSorted("created_at");
      body.articles.forEach((article) => {
        expect(typeof article.author).toBe("string");
        expect(typeof article.title).toBe("string");
        expect(typeof article.article_id).toBe("number");
        expect(typeof article.topic).toBe("string");
        expect(typeof article.created_at).toBe("string");
        expect(typeof article.votes).toBe("number");
        expect(typeof article.article_img_url).toBe("string");
        expect(typeof article.comment_count).toBe("number");
        expect(article).not.toHaveProperty("body")
      })
    })
  })
});

describe("GET /api/articles (sorting queries)", () => {
  test("status:200-sorts by votes ascending", () => {
    return request(app)
    .get("/api/articles?sort_by=votes&order=asc")
    .expect(200)
    .then(({body}) => {
      expect(body.articles).toBeSortedBy("votes", { asceding: true});
    })
  })
  test("status:400-invalid sort_by", () => {
    return request(app)
    .get("/api/articles?sort_by=body&order=desc")
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("Invalid column query.");
    })
  })
  test("status:400-sorts by invalid order", () => {
    return request(app)
    .get("/api/articles?order=hello")
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("Invalid order query.");
    })
  })
  test("status:200-when mispelling 'sort_by' the query will be ignored and default query will be used", () => {
    return request(app)
    .get("/api/articles?soort_by=votes&order=asc")
    .expect(200)
    .then(({body}) => {
      expect(body.articles).toBeSortedBy("created_at", { asceding: true});
    })
  })
});

describe("GET /api/articles (topic query)", () => {
  test("status:200 - responds with articles with the requested topic", () => {
    return request(app)
    .get("/api/articles?topic=mitch")
    .expect(200)
    .then(({body}) => {
      expect(body.articles.length).toBeGreaterThan(0);
      body.articles.forEach((article) => {
        expect(article.topic).toBe("mitch")
      })
    })
  })
  test("status:200 - responds with all articles when topic was not passed in", () => {
    return request(app)
    .get("/api/articles?")
    .expect(200)
    .then(({body}) => {
      expect(body.articles).toHaveLength(13);
      expect(body.articles).toBeSorted("created_at")
    })
  })
  test("status:200 - responds with am empty array when the passed topic with no associated articles", () => {
    return request(app)
    .get("/api/articles?topic=paper")
    .expect(200)
    .then(({body}) => {
      expect(body.articles).toEqual([])
    })
  })
  test("status:404 - when passed a topic that is not found", () => {
    return request(app)
    .get("/api/articles?topic=appleorange")
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe(`Topic not found.`)
    })
  })
})

describe("GET /api/articles/:article_id/comments", () => {
  test("status: 200 - responds with all the comments for an requested article", () => {
    return request(app)
    .get("/api/articles/7/comments")
    .expect(200)
    .then(({body}) => {
      expect(body.comments).toHaveLength(0);
      expect(body.comments).toBeSorted("created_at");
      body.comments.forEach((comment) => {
        expect(typeof comment.comment_id).toBe("number");
        expect(typeof comment.votes).toBe("number");
        expect(typeof comment.created_at).toBe("string");
        expect(typeof comment.author).toBe("string");
        expect(typeof comment.body).toBe("string");
        expect(typeof comment.article_id).toBe("number");
      });
    })
  });
  test("status: 404 - when passed a valid id but doesn't exist", () => {
    return request(app)
    .get("/api/articles/9999/comments")
    .expect(404)
    .then(({body}) => {
     expect(body.msg).toBe("No article found under article_id 9999.")
    })
  });
  test("status 400 - when passed an invalid id", () => {
    return request(app)
    .get("/api/articles/apple/comments")
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("Bad request.")
    })
  })
});

describe("POST /api/articles/:article_id/comments", () => {
  test("status: 201 - responds with the newly added comment", () => {
    return request(app)
    .post("/api/articles/1/comments")
    .send({username: "butter_bridge", body: "testbody1"})
    .expect(201)
    .then(({body}) => {
      expect(typeof body.comment.comment_id).toBe("number");
      expect(typeof body.comment.article_id).toBe("number");
      expect(typeof body.comment.author).toBe("string");
      expect(typeof body.comment.body).toBe("string");
      expect(typeof body.comment.created_at).toBe("string");
      expect(typeof body.comment.votes).toBe("number")
    })
  })
  test("status: 404 - when pass valid article_id but doesn't exist", ()=> {
    return request(app)
    .post("/api/articles/999/comments")
    .send({username: "butter_bridge", body: "testbody4"})
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe(`No article found under article_id 999.`)
    })
  })
  test("status: 404 - when pass invalid article_id", ()=> {
    return request(app)
    .post("/api/articles/apple/comments")
    .send({username: "butter_bridge", body: "testbody5"})
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe(`Bad request.`)
    })
  })
});

describe("PATCH /api/articles/:article_id", () => {
  test("status:200 - increments the current article's vote property by given positive newVote", () => {
    return request(app)
    .patch("/api/articles/1")
    .send({ inc_votes: 1 })
    .expect(200)
    .then(({body}) => {
      expect(body.article.votes).toBe(101)
    })
  })
  test("status:200 - decrements the current article's vote property by given negative newVote", () => {
    return request(app)
    .patch("/api/articles/1")
    .send({ inc_votes: -20 })
    .expect(200)
    .then(({body}) => {
      expect(body.article.votes).toBe(80)
    })
  })
  test("status 404 - valid ID but not found", () => {
    return request(app)
      .patch("/api/articles/9999")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No article found under article_id 9999.");
      })
  })
  test("status 400 - invalid article_id", () => {
    return request(app)
      .patch("/api/articles/apple")
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request.");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("status: 204 - deleter the comments with the passed commnet_id", () => {
    return request(app)
    .delete("/api/comments/1")
    .expect(204)
    .then(({body}) => {
      expect(body).toEqual({})
      return db.query(`SELECT * FROM comments WHERE comment_id = 1`)
      .then(({rows}) => {
        expect(rows.length).toBe(0)
      })
    })
    
  })
  test("status: 404 - when passed a valid id but doesn't exit", () => {
    return request(app)
    .delete("/api/comments/9999")
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe("No comments found under comment_id 9999.")
    })
  })
  test("status: 400 - when passed an invalid id", () => {
    return request(app)
    .delete("/api/comments/apple")
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("Bad request.")
    })
  })
});

describe("GET /api/users", () => {
  test("status: 200 - responds with all the users", () => {
    return request(app)
    .get("/api/users")
    .expect(200)
    .then(({body}) => {
      expect(body.users).toHaveLength(4);
      body.users.forEach((user) => {
        expect(typeof user.username).toBe("string");
        expect(typeof user.name).toBe("string");
        expect(typeof user.avatar_url).toBe("string")
      })
    })
  })
})
