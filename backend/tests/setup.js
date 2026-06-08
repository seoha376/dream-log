// 테스트 실행 전 DB 초기화

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test_secret";
process.env.DATABASE_PATH = process.env.DATABASE_PATH || "./src/db/database.sqlite";

const initDb = require("../src/db/initDb");

beforeAll((done) => {
  initDb();
  setTimeout(done, 100);
});