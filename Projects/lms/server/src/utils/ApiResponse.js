export const ApiResponse = {
  success(res, data = null, message = "Success") {
    return res.status(200).json({ success: true, message, data });
  },
  error(res, message = "Something went wrong", status = 500) {
    return res.status(status).json({ success: false, message });
  },
};
