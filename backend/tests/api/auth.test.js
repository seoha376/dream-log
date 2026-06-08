const request = require("supertest");
const app = require("../../src/app");
const db = require("../../src/db/database");
const initDb = require("../../src/db/initDb");

describe("Auth API", () => {
  beforeAll((done) => {
    process.env.JWT_SECRET = "test_secret";

  db.serialize(() => {
    db.run("PRAGMA foreign_keys = OFF");

    db.run("DELETE FROM dream_tags");
    db.run("DELETE FROM dreams");
    db.run("DELETE FROM tags");
    db.run("DELETE FROM users", (err) => {
      if (err) return done(err);

      db.run("PRAGMA foreign_keys = ON");

      initDb();

      setTimeout(done, 100);
    });
  });
});

  test("POST /api/auth/register 회원가입 성공", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        email: "test@example.com",
        password: "password123",
        username: "tester",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe("test@example.com");
    expect(res.body.data.username).toBe("tester");
  });

  test("POST /api/auth/login 로그인 성공", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "test@example.com",
        password: "password123",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe("test@example.com");
  });

  test("POST /api/auth/login 잘못된 비밀번호면 401 반환", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "test@example.com",
        password: "wrongpassword",
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("INVALID_CREDENTIALS");
  });

  test("POST /api/auth/register 필수값 누락이면 400 반환", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        email: "missing@example.com",
        password: "password123",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("MISSING_FIELDS");
  });
});