const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// REGISZTRÁCIÓ VÉGPONT
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Ellenőrzés
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'Ez az email cím már foglalt!' });
    }

    // 2. Titkosítás
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Létrehozás
    const newUser = new User({
      email,
      password: hashedPassword,
      profiles: []
    });

    const savedUser = await newUser.save();

    // 4. Token
    const token = jwt.sign({ id: savedUser._id }, "TITKOS_KULCS_123", { expiresIn: '1h' });

    res.json({ token, user: { id: savedUser._id, email: savedUser.email } });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;