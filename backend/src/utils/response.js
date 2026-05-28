// backend/src/utils/response.js

const success = (res, statusCode = 200, data = {}) => {
  return res.status(statusCode).json({
    success: true,
    data
  });
};

const error = (
  res,
  statusCode = 500,
  code = "INTERNAL_SERVER_ERROR",
  message = "Something went wrong"
) => {
  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message
    }
  });
};

module.exports = {
  success,
  error
};