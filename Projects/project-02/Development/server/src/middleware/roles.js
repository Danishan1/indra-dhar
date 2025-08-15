export function permit(...allowed) {
  return (req, res, next) => {
    const { role } = req.user;
    if (allowed.includes(role)) {
      return next();
    }
    return res.status(403).json({ message: "Forbidden" });
  };
}
