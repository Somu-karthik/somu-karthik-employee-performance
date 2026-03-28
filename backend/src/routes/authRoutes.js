const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

// ✅ TEST ROUTE
router.get('/test', (req, res) => {
  res.send("Auth route working ✅");
});

router.post('/login', authController.login);
router.post('/register', authController.register);

module.exports = router;
