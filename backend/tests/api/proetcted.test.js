const request = require("supertest");
const app = require("../../src/app");

describe("Protected Dream Routes", () => {
  let token;

  beforeAll(async () => {
    const uniqueEmail = `protected_${Date.now()}@example.com`;

    await request(app)
      .post("/api/auth/register")
      .send({
        email: uniqueEmail,
        password: "password123",
        username: "protectedUser",
      });

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({
        email: uniqueEmail,
        password: "password123",
      });

    token = loginRes.body.data.token;
  });

  test("GET /api/dreams 토큰 없이 접근하면 401", async () => {
    const res = await request(app).get("/api/dreams");

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("NO_TOKEN");
  });

  test("GET /api/dreams 토큰으로 접근하면 200", async () => {
    const res = await request(app)
      .get("/api/dreams")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});