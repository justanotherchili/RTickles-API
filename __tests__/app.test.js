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

describe("GET /api/articles/:article_id", () => {
  test("get article by id", async () => {
    const res = await request(app).get("/api/articles/1").expect(200);
    expect(res.body).toMatchObject({
      author: expect.any(String),
      title: expect.any(String),
      article_id: expect.any(Number),
      body: expect.any(String),
      topic: expect.any(String),
      created_at: expect.any(String),
      votes: expect.any(Number),
      article_img_url: expect.any(String),
    });
    expect(res.body.article_id).toBe(1);
  });
  test("Returns 404 not found for a non existent id", async () => {
    const res = await request(app).get("/api/articles/99999").expect(404);

    const errorMessage = res.body.msg;

    expect(errorMessage).toBe(`Article Not Found`);
  });
  test("Returns 400 for a bad request", async () => {
    const res = await request(app).get("/api/articles/bonk").expect(400);
    const errorMessage = res.body.msg;
    expect(errorMessage).toBe(`Bad Request`);
  });
});

describe("GET /api/articles", () => {
  test("get all articles", async () => {
    const res = await request(app).get("/api/articles").expect(200);
    const articles = res.body;
    expect(articles).toHaveLength(13);
    articles.forEach((article) => {
      expect(article).toMatchObject({
        author: expect.any(String),
        title: expect.any(String),
        article_id: expect.any(Number),
        topic: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        article_img_url: expect.any(String),
        comment_count: expect.any(Number),
      });
      expect(article.body).toBeUndefined();
    });
  });
});
