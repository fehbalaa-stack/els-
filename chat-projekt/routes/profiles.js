const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // <-- Ez a 3. sor!
const Profile = require('../models/Profile');
const User = require('../models/User');

// 1. LÉTREHOZÁS
router.post('/', auth, async (req, res) => {
  try {
    const { childName, dateOfBirth, emergencyPhone, medicalInfo } = req.body;
    const newProfile = new Profile({
      user: req.user.id,
      childName,
      dateOfBirth,
      emergencyPhone,
      medicalInfo
    });
    const savedProfile = await newProfile.save();
    await User.findByIdAndUpdate(req.user.id, { $push: { profiles: savedProfile._id } });
    res.json(savedProfile);
  } catch (err) { res.status(500).send('Szerver hiba'); }
});

// 2. LISTÁZÁS
router.get('/', auth, async (req, res) => {
  try {
    const profiles = await Profile.find({ user: req.user.id });
    res.json(profiles);
  } catch (err) { res.status(500).send('Szerver hiba'); }
});

// 3. NYILVÁNOS ADATLAP (QR kódhoz)
router.get('/public/:id', async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) return res.status(404).json({ msg: 'Nincs ilyen profil' });
    res.json(profile);
  } catch (err) { res.status(500).send('Szerver hiba'); }
});

// 4. ÚJ: GPS POZÍCIÓ MENTÉSE (Nyilvános!)
router.post('/public/location/:id', async (req, res) => {
  try {
    const { lat, lng } = req.body;
    
    // Frissítjük a profilt a koordinátákkal
    await Profile.findByIdAndUpdate(req.params.id, {
      location: {
        lat,
        lng,
        updatedAt: new Date()
      }
    });
    
    res.json({ msg: "Pozíció elmentve!" });
  } catch (err) {
    console.error(err);
    res.status(500).send('Hiba a mentésnél');
  }
});

module.exports = router;