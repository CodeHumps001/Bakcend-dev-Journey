const { users } = require("../data/data");

function validateLogin(req, res, next) {
  const { email, password } = req.body;

  // 1. Check for required fields
  if (!email || !password) {
    return res.status(401).json({ error: "Email and Password are required" });
  }

  const userExist = users.find(
    (user) =>
      user.email.toLowerCase() === email.toLowerCase() &&
      user.password === password,
  );

  if (!userExist) {
    return res.status(401).json({ message: "Incorrect Credentials" });
  }

  next();
}

module.exports = validateLogin;
