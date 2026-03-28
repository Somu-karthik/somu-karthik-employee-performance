const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { createUser, findUserByEmail } = require("../models/userModel");

// ✅ REGISTER
const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await findUserByEmail(email);

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser(name, email, hashedPassword, role);

    const user = newUser.rows[0];
    delete user.password;

    res.status(201).json({
      success: true,
      user,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ LOGIN (your code — already correct)
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userResult = await findUserByEmail(email);

    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = userResult.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    delete user.password;

    res.json({
      success: true,
      message: "Login successful",
      user,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ EXPORT (VERY IMPORTANT)
module.exports = { register, login };