const jwt = require("jsonwebtoken");
const authMiddleware = require("../../src/middleware/authMiddleware");

describe("authMiddleware", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = "test_secret";
  });

  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  test("valid token이면 req.user를 설정하고 next를 호출한다", () => {
    const token = jwt.sign(
      { user_id: 1, email: "test@example.com" },
      process.env.JWT_SECRET
    );

    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };

    const res = mockResponse();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(req.user).toEqual({
      user_id: 1,
      email: "test@example.com",
    });
    expect(next).toHaveBeenCalled();
  });

  test("토큰이 없으면 401을 반환한다", () => {
    const req = {
      headers: {},
    };

    const res = mockResponse();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: "NO_TOKEN",
        message: "Authorization token is required",
      },
    });
    expect(next).not.toHaveBeenCalled();
  });
});