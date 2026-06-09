const { success, error } = require("../../src/utils/response");

describe("response utils", () => {
  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  test("success는 success true와 data를 반환한다", () => {
    const res = mockResponse();

    success(res, 201, { user_id: 1 });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: {
        user_id: 1,
      },
    });
  });

  test("error는 success false와 error 객체를 반환한다", () => {
    const res = mockResponse();

    error(res, 400, "MISSING_FIELDS", "All fields are required");

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: "MISSING_FIELDS",
        message: "All fields are required",
      },
    });
  });
});