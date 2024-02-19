const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const data = require("../db/data/test-data/");



beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  db.end();
});



describe("Path not found 404", () => {
  test("returns 404 for path that doesnt exist", async () => {
    const res = await request(app).get("/api/uhertiguer").expect(404);
    const error = res.body;
    expect(error.msg).toBe("Path Not Found");
  });
});

describe("GET /api/topics", () => {
  test("returns a 200 response code", async () => {
    await request(app).get("/api/topics").expect(200);
  });
  test("GET all topics with slug and description properties", async () => {
    const res = await request(app).get("/api/topics").expect(200);
    const topics = res.body;
    expect(topics.length).toBe(3);
    topics.forEach((topic) => {
      expect(topic).toMatchObject({
        slug: expect.any(String),
        description: expect.any(String),
      });
    });
  });
});

describe("GET /api/", () => {
  test("get all APIs with the decription, queries and example", async () => {
    const res = await request(app).get("/api").expect(200);
    const endpoints = res.body;
    for (const key in endpoints) {
      expect(endpoints[key]).toMatchObject({
        description: expect.any(String),
        queries: expect.any(Object),
        exampleResponse: expect.any(Object),
      });
    }
  });
});
