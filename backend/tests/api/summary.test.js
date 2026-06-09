const request = require("supertest");
const app = require("../../src/app");

describe("Dream Summary API", () => {
  let token;
  let dreamId;

  beforeAll(async () => {
    const user = {
      email: `summary${Date.now()}@test.com`,
      username: `summaryuser${Date.now()}`,
      password: "password123"
    };

    await request(app).post("/api/auth/register").send(user);

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({
        email: user.email,
        password: user.password
      });

    token = loginRes.body.data.token;

    const dreamRes = await request(app)
      .post("/api/dreams")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Long dream",
        content:
          "I was flying over a strange city with purple clouds and glowing streets. Then I met someone who told me that the city was built from forgotten memories.",
        dream_date: "2026-06-08",
        tags: []
      });

    dreamId = dreamRes.body.dream_id;
  });

  test("POST /api/dreams/:id/summary should generate summary", async () => {
    const res = await request(app)
      .post(`/api/dreams/${dreamId}/summary`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.dream_id).toBe(dreamId);
    expect(res.body.ai_summary).toBeDefined();
    expect(res.body.ai_summary.length).toBeLessThanOrEqual(300);
  });

  test("POST /api/dreams/:id/summary should return 404 for missing dream", async () => {
    const res = await request(app)
      .post("/api/dreams/999999/summary")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.code).toBe("DREAM_NOT_FOUND");
  });

  test("POST /api/dreams/:id/summary should return 401 without token", async () => {
    const res = await request(app).post(`/api/dreams/${dreamId}/summary`);

    expect(res.statusCode).toBe(401);
  });
});