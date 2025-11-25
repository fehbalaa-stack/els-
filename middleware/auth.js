const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// --- 1. REGISZTRÁCIÓ (Ez volt eddig is) ---
router.post('/register', async (req, res) => {
  try {
    const { email, password, fullName, phoneNumber, address } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'Ez az email cím már foglalt!' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashedPassword,
      fullName,
      phoneNumber,
      address,
      profiles: []
    });

    const savedUser = await newUser.save();

    const token = jwt.sign({ id: savedUser._id }, "TITKOS_KULCS_123", { expiresIn: '1h' });

    res.json({
      token,
      user: {
        id: savedUser._id,
        email: savedUser.email,
        fullName: savedUser.fullName,
        role: savedUser.role // Visszaküldjük a rangot is!
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- 2. ÚJ: BEJELENTKEZÉS (LOGIN) ---
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Megnézzük, létezik-e ilyen felhasználó
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Nincs ilyen felhasználó ezzel az emaillel.' });
    }

    // Ellenőrizzük a jelszót
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Hibás jelszó!' });
    }

    // Ha minden oké, gyártunk egy tokent (belépőkártyát)
    const token = jwt.sign({ id: user._id }, "TITKOS_KULCS_123", { expiresIn: '1h' });

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role // Fontos: visszaküldjük, hogy admin-e!
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;