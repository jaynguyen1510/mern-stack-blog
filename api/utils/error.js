// utils/customErrorHandler.js
export const customErrorHandler = (res, statusCode, message) => {
  return res.status(statusCode).json({
    status: "ERR",
    success: false,
    message: message,
  });
};
