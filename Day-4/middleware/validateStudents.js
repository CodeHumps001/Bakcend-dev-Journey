const { students } = require("../data/data");

const validateStudent = (req, res, next) => {
  const { name, address, email, course } = req.body;
  const uniqueStudent = students.find((student) => student.email === email);

  if (!name || !address || !email || !course) {
    console.log("name, email, and address are required");
    return res
      .status(400)
      .json({ error: "name, email, and address are required" });
  } else if (uniqueStudent) {
    console.log(`User with this email: ${email} already exists`);
    return res
      .status(400)
      .json({ error: `User with this email: ${email} already exists` });
  }
  next();
};

module.exports = validateStudent;
