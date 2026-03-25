const { users } = require("../data/data");

//register user

const registerUser = (req, res) => {
  const { name, email, role, password } = req.body;
  users.push({ id: users.length + 1, name, email, role, password });
  res.status(201).json({ message: "Registration complete!!" });
  console.log("Registration successfull");
};

const loginUser = (req, res) => {
  const { email, password } = req.body;
  res.status(200).json({ message: "Login Successful" });
  console.log("Login successful");
};

module.exports = { registerUser, loginUser };
