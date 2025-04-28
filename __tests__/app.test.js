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

describe.only("GET /api/articles/:article_id", () => {
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