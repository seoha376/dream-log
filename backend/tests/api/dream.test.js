const request = require("supertest");
const app = require("../../src/app");

describe("Dream API", () => {
  let token;

  beforeAll(async () => {
    const uniqueEmail = `dream_${Date.now()}@example.com`;

    await request(app)
      .post("/api/auth/register")
      .send({
        email: uniqueEmail,
        password: "password123",
        username: "dreamUser",
      });

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({
        email: uniqueEmail,
        password: "password123",
      });

    token = loginRes.body.data.token;
  });

  test("POST /api/dreams 꿈 생성 성공", async () => {
    const res = await request(app)
      .post("/api/dreams")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Flying dream",
        content: "I was flying over the city.",
        dream_date: "2026-06-08",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Flying dream");
    expect(res.body.content).toBe("I was flying over the city.");
  });

  test("POST /api/dreams 필수값 누락이면 400", async () => {
    const res = await request(app)
      .post("/api/dreams")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Missing content",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("title, content, dream_date are required");
  });

  test("GET /api/dreams/999999 존재하지 않는 꿈이면 404", async () => {
    const res = await request(app)
      .get("/api/dreams/999999")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Dream not found");
  });
});