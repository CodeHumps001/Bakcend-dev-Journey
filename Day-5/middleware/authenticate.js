const jwt = require("jsonwebtoken");

// This middleware runs BEFORE the route handler
// It checks if the request has a valid token
// If yes → attaches user info to req.user and calls next()
// If no → returns 401 Unauthorized immediately

const authenticate = (req, res, next) => {
  // Tokens are sent in the Authorization header like this:
  // Authorization: Bearer eyJhbGci...
  // We need to extract just the token part after "Bearer "

  const authHeader = req.headers.authorization;

  // Check if Authorization header exists
  if (!authHeader) {
    return res.status(401).json({
      error: "Access denied. No token provided.",
    });
  }

  // Check if it follows the "Bearer TOKEN" format
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Invalid token format. Use: Bearer <token>",
    });
  }

  // Extract just the token — split by space and take index 1
  const token = authHeader.split(" ")[1];

  try {
    // jwt.verify() does two things:
    // 1. Checks that the token was signed with our secret key
    // 2. Checks that the token hasn't expired
    // If either check fails it throws an error
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user info to the request
    // Now any route handler can access req.user.id, req.user.role etc.
    req.user = decoded;

    // Pass control to the next middleware or route handler
    next();
  } catch (err) {
    // jwt.verify() throws JsonWebTokenError if token is invalid
    // and TokenExpiredError if token has expired
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ error: "Token has expired. Please login again." });
    }
    return res.status(401).json({ error: "Invalid token." });
  }
};

module.exports = authenticate;
