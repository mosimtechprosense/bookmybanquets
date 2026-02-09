const getDashboardStats = async (req, res, next) => {
  try {
    res.json({
      success: true,
      stats: {
        users: 10,
        listings: 25,
        leads: 40,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getDashboardStats };
