export const ApiResponse = {
  success({
    res,
    data = null,
    message = "Success",
    statusCode = 200,
    meta = {},
  }) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      meta,
    });
  },

  created({ res, data = null, message = "Created successfully", meta = {} }) {
    return res.status(201).json({
      success: true,
      message,
      data,
      meta,
    });
  },

  error({
    res,
    message = "Something went wrong",
    statusCode = 500,
    errors = null,
  }) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
    });
  },

  noContent({ res }) {
    return res.status(204).send();
  },
};
