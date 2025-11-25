const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Kötelező adatok
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // Profil adatok (alapértelmezett értékkel, hogy ne legyen hiba ha üres)
  fullName: { type: String, default: 'Névtelen' },
  phoneNumber: { type: String, default: '' },
  address: { type: String, default: '' },
  
  // Kapcsolat a gyerekekhez
  profiles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }],
  
  // Admin jogok
  role: { 
    type: String, 
    default: 'user', // Alapból user, de átírhatod adminra a teszthez
    enum: ['user', 'admin'] 
  },
  isBanned: { type: Boolean, default: false },
  isPremium: { type: Boolean, default: false },
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);