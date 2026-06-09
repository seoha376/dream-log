// 실제 서버 실행 + DB 초기화

require("dotenv").config();

const app = require("./app");
const initDb = require("./db/initDb");

const PORT = process.env.PORT || 5000;

initDb();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});