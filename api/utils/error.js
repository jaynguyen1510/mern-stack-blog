// utils/customErrorHandler.js
export const customErrorHandler = (res, statusCode, message) => {
  return res.status(statusCode).json({
    status: "ERR",
    success: false,
    message: message,
  });
};
// utils/customSuccessHandler.js
export const customSuccessHandler = (res, statusCode, message, data = {}) => {
  return res.status(statusCode).json({
    status: "OK",
    success: true,
    message: message,
    data: data, // Dữ liệu trả về (nếu có)
  });
};
