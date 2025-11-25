const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  childName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  emergencyPhone: { type: String, required: true },
  medicalInfo: { type: String, default: "Nincs megadva orvosi információ." },
  
  // ÚJ: Itt tároljuk a legutolsó ismert pozíciót
  location: {
    lat: { type: Number }, // Szélesség
    lng: { type: Number }, // Hosszúság
    updatedAt: { type: Date } // Mikor küldték?
  }
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);