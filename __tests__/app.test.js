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

describe.only("GET /api/topics", () => {
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
})