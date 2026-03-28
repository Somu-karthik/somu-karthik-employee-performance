const db = require("../utils/db");

const createUser = async (name, email, password, role) => {
  return db.query(
    "INSERT INTO users (name, email, password, role) VALUES ($1,$2,$3,$4) RETURNING *",
    [name, email, password, role]
  );
};

const findUserByEmail = async (email) => {
  return db.query("SELECT * FROM users WHERE email=$1", [email]);
};

module.exports = { createUser, findUserByEmail };