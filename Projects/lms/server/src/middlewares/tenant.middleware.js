export const tenantMiddleware = (req, res, next) => {
  if (!req.user?.tenant_id) {
    return res.status(403).json({ message: "Tenant not found" });
  }

  req.tenantId = req.user.tenant_id;

  next();
};
