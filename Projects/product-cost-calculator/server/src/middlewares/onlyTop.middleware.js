export const onlyAdmin = (req, res, next) => {
  const role = req.user.role;
  if (role !== "admin") {
    return res
      .status(403)
      .json({ success: false, message: "Access denied: admin role required" });
  }

  next();
};
export const onlyAdminManager = (req, res, next) => {
  const role = req.user.role;

  if (role !== "admin" && role !== "manager") {
    return res.status(403).json({
      success: false,
      message: "Access denied: admin or manager role required",
    });
  }

  next();
};
