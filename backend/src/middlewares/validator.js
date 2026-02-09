const { ZodError } = require("zod");

const validator = (schema) => (req, res, next) => {
  try {
    ["body", "params", "query"].forEach((key) => {
      if (schema[key]) {
        req[key] = schema[key].parse(req[key]);
      }
    });

    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation Failed",
        errors: error.errors,
      });
    }

    next(error);
  }
};

module.exports = { validator };
