const { sendError } = require("../utils/response");
const validate = (schema) => {
  return (req, res, next) => {
    // 1. Ensure req.body exists (prevents crashes if body-parser is missing)
    if (!req.body) {
      return sendError(res, "Request body is missing", 400);
    }

    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = {};

      // 2. Access .issues or .errors safely
      // Zod's ZodError object contains an 'issues' array
      const zodIssues = result.error?.issues || [];

      zodIssues.forEach((err) => {
        const field = err.path[0];
        errors[field] = err.message;
      });

      return sendError(res, "Validation failed", 400, errors);
    }

    req.body = result.data;
    next();
  };
};

module.exports = validate;
