const { users } = require("../data/data");

function validateUser(req, res, next) {
  const { name, email, role, password } = req.body;

  if (!name || !email || !role || !password) {
    return res.status(400).json({
      error: "All fields (name, email, role, password) are required.",
    });
  }

  const normalizedEmail = email.toLowerCase();
  const userExist = users.find(
    (user) => user.email.toLowerCase() === normalizedEmail,
  );

  if (userExist) {
    return res.status(409).json({
      error: `Email (${email}) already exists.`,
    });
  }

  next();
}

module.exports = validateUser;
