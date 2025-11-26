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
// --- ÚJ: FELHASZNÁLÓ ADATAINAK LEKÉRÉSE (ROLE CHECK) ---
router.get('/me', auth, async (req, res) => {
  try {
    // A req.user.id-t a middleware adja hozzá a tokenből!
    const user = await User.findById(req.user.id).select('role email fullName isPremium');
    if (!user) {
        return res.status(404).json({ msg: 'Felhasználó nem található.' });
    }
    res.json(user); // Visszaküldjük a jelenlegi jogokat
  } catch (err) {
    res.status(500).send('Szerver hiba');

    // --- IDEIGLENES: JELSZÓ RESET ELFELEJTETT ADMINOKNAK ---
router.post('/debug-reset', async (req, res) => {
  try {
    // Keresd meg a felhasználót a címed alapján (HASZNÁLD A SAJÁT ADMIN EMAIL CÍMEDET!)
    const user = await User.findOne({ email: 'admin-new@oldalam.hu' }); 
    if (!user) return res.status(404).json({ msg: 'A felhasználó nem található' });

    // ÚJ JELSZÓ HASHELÉSE: 12345
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash('12345', salt);
    await user.save();
    
    // Figyelem: A jelszó mostantól 12345!
    res.json({ msg: 'A jelszó resetelve: 12345. Mostantól be tudsz lépni!' });
  } catch (err) {
    res.status(500).send('Szerver hiba a resetelésnél');
  }
});
  }
});

module.exports = router;