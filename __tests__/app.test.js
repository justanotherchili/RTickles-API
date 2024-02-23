const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const data = require("../db/data/test-data/");
const articles = require("../db/data/test-data/articles");
const jestSorted = require("jest-sorted");
const endpointsJson = require("../endpoints.json");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  db.end();
});

describe("Path not found 404", () => {
  test("returns 404 for path that doesnt exist", async () => {
    const res = await request(app).get("/api/uhertiguer").expect(404);
    const error = res.body.msg;
    expect(error).toBe("Path Not Found");
  });
});

describe("GET /api/topics", () => {
  test("returns a 200 response code", async () => {
    await request(app).get("/api/topics").expect(200);
  });
  test("GET all topics with slug and description properties", async () => {
    const res = await request(app).get("/api/topics").expect(200);
    const topics = res.body.topics;
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
    const endpoints = res.body.endPoints;
    for (const key in endpoints) {
      expect(endpoints[key]).toMatchObject({
        description: expect.any(String),
        queries: expect.any(Object),
        exampleResponse: expect.any(Object),
      });
    }
  });
  test("matches with the endpoints.json file", async () => {
    const res = await request(app).get("/api").expect(200);
    const endpointsRes = res.body.endPoints;
    expect(endpointsRes).toEqual(endpointsJson);
  });
});

describe("GET /api/articles/:article_id", () => {
  test("get article by id", async () => {
    const res = await request(app).get("/api/articles/1").expect(200);
    const article = res.body.article;
    expect(article).toMatchObject({
      author: expect.any(String),
      title: expect.any(String),
      article_id: 1,
      body: expect.any(String),
      topic: expect.any(String),
      created_at: expect.any(String),
      votes: expect.any(Number),
      article_img_url: expect.any(String),
      comment_count: expect.any(Number),
    });
  });
  test("Returns 404 not found for a non existent id", async () => {
    const res = await request(app).get("/api/articles/99999").expect(404);

    const errorMessage = res.body.msg;
    expect(errorMessage).toBe(`Article Not Found`);
  });
  test("Returns 400 for a bad request for wrong type", async () => {
    const res = await request(app).get("/api/articles/bonk").expect(400);
    const errorMessage = res.body.msg;
    expect(errorMessage).toBe(`Bad Request. Invalid Input Type`);
  });
});

describe("GET /api/articles", () => {
  test("get all articles", async () => {
    const res = await request(app).get("/api/articles").expect(200);
    const articles = res.body.articles;
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
  test("articles are sorted by date", async () => {
    const res = await request(app).get("/api/articles").expect(200);
    const articles = res.body.articles;
    expect(articles).toBeSortedBy("created_at", { descending: true });
  });
  test("get articles filtered by topic", async () => {
    const res = await request(app).get("/api/articles?topic=cats").expect(200);
    const filteredArticles = res.body.articles;
    expect(filteredArticles).toHaveLength(1);
    filteredArticles.forEach((article) => {
      expect(article).toMatchObject({
        author: expect.any(String),
        title: expect.any(String),
        article_id: expect.any(Number),
        topic: "cats",
        created_at: expect.any(String),
        votes: expect.any(Number),
        article_img_url: expect.any(String),
        comment_count: expect.any(Number),
      });
    });
  });
  test.only("topic exists but no articles returns nothing", async () => {
    const res = await request(app).get("/api/articles?topic=paper").expect(200);
    const filteredArticles = res.body.articles;
    expect(filteredArticles).toHaveLength(0);
  });
  test("404 not found if the topic does not exist", async () => {
    const res = await request(app).get("/api/articles?topic=bonk").expect(404);
    const errorMessage = res.body.msg;
    expect(errorMessage).toBe("Topic Not Found");
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("get all comments for article ID", async () => {
    const res = await request(app).get("/api/articles/9/comments").expect(200);
    const comments = res.body.comments;
    expect(comments).toHaveLength(2);
    comments.forEach((comment) => {
      expect(comment).toMatchObject({
        comment_id: expect.any(Number),
        votes: expect.any(Number),
        created_at: expect.any(String),
        author: expect.any(String),
        body: expect.any(String),
        article_id: 9,
      });
    });
  });
  test("return a 404 error when the article id doesnt exist", async () => {
    const res = await request(app)
      .get("/api/articles/437509834/comments")
      .expect(404);
    const errorMessage = res.body.msg;
    expect(errorMessage).toBe(`Article Not Found`);
  });
  test("return a 400 error when the article isnt an id number", async () => {
    const res = await request(app)
      .get("/api/articles/oranges/comments")
      .expect(400);
    const errorMessage = res.body.msg;
    expect(errorMessage).toBe(`Bad Request. Invalid Input Type`);
  });
  test("return no comments when the article exists but doesnt have comments", async () => {
    const res = await request(app).get("/api/articles/2/comments").expect(200);
    const comments = res.body.comments;
    expect(comments).toHaveLength(0);
  });
  test("return most recent comments first", async () => {
    const res = await request(app).get("/api/articles/1/comments").expect(200);
    const comments = res.body.comments;
    expect(comments).toBeSortedBy("created_at", { descending: true });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("Allows existing user to post comment with a 201 and the comment returned", async () => {
    const res = await request(app)
      .post("/api/articles/2/comments")
      .send({ username: "rogersop", body: "help me" })
      .expect(201);
    expect(res.body).toMatchObject({
      comment: {
        comment_id: 19,
        body: "help me",
        article_id: 2,
        author: "rogersop",
        votes: 0,
        created_at: expect.any(String),
      },
    });
  });
  test("Posting to a non-existent article_id returns 400 Bad Request", async () => {
    const res = await request(app)
      .post("/api/articles/999999/comments")
      .send({ username: "rogersop", body: "help me" })
      .expect(400);
    expect(res.body).toMatchObject({
      msg: "Bad Request. Non-Existent ID Value",
    });
  });
  test("Posting to an invalid type for article ID returns 400 Bad Request", async () => {
    const res = await request(app)
      .post("/api/articles/bonk/comments")
      .send({ username: "rogersop", body: "help me" })
      .expect(400);
    expect(res.body).toMatchObject({
      msg: "Bad Request. Invalid Input Type",
    });
  });
  test("Should return a 400 bad request is missing fields", async () => {
    const res = await request(app)
      .post("/api/articles/2/comments")
      .send({ username: "rogersop" })
      .expect(400);
    expect(res.body).toMatchObject({
      msg: "Bad Request. Missing Required Field Values",
    });
  });

  test("Should return a 400 bad request if user does not exist", async () => {
    const res = await request(app)
      .post("/api/articles/2/comments")
      .send({ username: "darkfester", body: "I dont exist" })
      .expect(400);
    expect(res.body).toMatchObject({
      msg: "Bad Request. Non-Existent ID Value",
    });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("Increment vote count returning the updated article with 200 status code", async () => {
    const res = await request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 1 })
      .expect(200);
    expect(res.body).toMatchObject({
      article_id: 1,
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: "2020-07-09T20:11:00.000Z",
      votes: 101,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    });
  });
  test("Bad request if missing body", async () => {
    const res = await request(app)
      .patch("/api/articles/1")
      .send({ zamba: 2 })
      .expect(400);
    expect(res.body.msg).toBe("Bad Request. Missing Required Field Values");
  });
  test("404 not found if article is not found", async () => {
    const res = await request(app)
      .patch("/api/articles/234234")
      .send({ inv_votes: 2 })
      .expect(404);
    expect(res.body.msg).toBe("Article Not Found");
  });
  test("400 if article is an invalid ID type", async () => {
    const res = await request(app)
      .patch("/api/articles/bonkey")
      .send({ inv_votes: 2 })
      .expect(400);
    expect(res.body.msg).toBe("Bad Request. Invalid Input Type");
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("Deletes given comment by comment_id returning a 204 status with no content", async () => {
    const res = await request(app).delete("/api/comments/1").expect(204);
  });
  test("404 not found if comment is not found", async () => {
    const res = await request(app).delete("/api/comments/234234").expect(404);
    expect(res.body.msg).toBe("Comment Not Found");
  });
  test("400 Bad requestif comment id is invalid type", async () => {
    const res = await request(app).delete("/api/comments/bonk").expect(400);
    expect(res.body.msg).toBe("Bad Request. Invalid Input Type");
  });
});

describe("GET /api/users", () => {
  test("Returns an array of user objects with properties username, name and avatar url", async () => {
    const res = await request(app).get("/api/users").expect(200);
    const users = res.body.users;
    expect(users).toHaveLength(4);
    users.forEach((user) => {
      expect(user).toMatchObject({
        username: expect.any(String),
        name: expect.any(String),
        avatar_url: expect.any(String),
      });
    });
  });
});
