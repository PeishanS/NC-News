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
      expect(body.article).toEqual(
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
      // below can be replaced by Jest Sort
      // const dates = body.articles.map((article) => new Date(article.created_at));
      // const formattedDates = [...dates].sort((a, b) => b -a);
      // expect(dates).toEqual(formattedDates);
    })
  })
});

describe("GET /api/articles/:article_id/comments", () => {
  test("status: 200 - responds with all the comments for an requested article", () => {
    return request(app)
    .get("/api/articles/1/comments")
    .expect(200)
    .then(({body}) => {
      expect(body.comments).toHaveLength(11);
      expect(body.comments).toBeSorted("created_at");
      body.comments.forEach((comment) => {
        expect(typeof comment.comment_id).toBe("number");
        expect(typeof comment.votes).toBe("number");
        expect(typeof comment.created_at).toBe("string");
        expect(typeof comment.author).toBe("string");
        expect(typeof comment.body).toBe("string");
        expect(typeof comment.article_id).toBe("number");
      });
      // below can be replaced by Jest Sort.
      // const dates = body.comments.map((comment) => new Date(comment.created_at));
      // const formattedDates = [...dates].sort((a, b) => b - a);
      // expect(dates).toEqual(formattedDates);
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

describe.only("POST /api/articles/:article_id/comments", () => {
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
  test("status: 404 - when missing information of body", ()=> {
    return request(app)
    .post("/api/articles/1/comments")
    .send({username: "butter_bridge"})
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe(`Missing required information.`)
    })
  })
  test("status: 404 - when missing information of username", ()=> {
    return request(app)
    .post("/api/articles/1/comments")
    .send({body: "testingbody3"})
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe(`Missing required information.`)
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
})