const onlyAdmin = (req, res, next) => {
  const role = req.user?.role;

  if (!role) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (role === "SUPER_ADMIN" || role === "ADMIN") {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Access denied",
  });
};

const allowRoles = (...roles) => {
  return (req, res, next) => {
    const role = req.user?.role;

    if (!role || !roles.includes(role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};

module.exports = {
  onlyAdmin,
  allowRoles,
};
