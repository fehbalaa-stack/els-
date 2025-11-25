const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http'); // 1. ÚJ: Kell a Node.js beépített szervere
const { Server } = require('socket.io'); // 2. ÚJ: Behúzzuk a Socket.io-t

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profiles');

const app = express();

// 3. ÚJ: Létrehozunk egy HTTP szervert az Express appból
const server = http.createServer(app);

// 4. ÚJ: Rákötjük a Socket.io-t a szerverre
const io = new Server(server, {
  cors: {
    origin: "https://gyerek-tracker-backend.onrender.com", // Fontos: Csak a Frontendünk kapcsolódhat!
    methods: ["GET", "POST"]
  }
});

app.use(express.json());
app.use(cors());

// Adatbázis kapcsolat
const mongoURI = "mongodb+srv://admin:jelszo123@cluster0.xvrv42j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

console.log("⏳ Csatlakozás megkezdése...");

mongoose.connect(mongoURI)
  .then(() => console.log('✅ SIKERÜLT! Csatlakozva a MongoDB-hez!'))
  .catch((err) => console.error('❌ Hiba a csatlakozásnál:', err));

// Route-ok
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);

// 5. ÚJ: Chat logika - Mi történjen, ha valaki kapcsolódik?
io.on('connection', (socket) => {
  console.log(`⚡ Valaki csatlakozott a chathez! (ID: ${socket.id})`);

  // Ha kapunk egy üzenetet...
  socket.on('send_message', (data) => {
    // ...akkor visszaküldjük mindenkinek (Broadcasting)
    io.emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('👋 Valaki kilépett.');
  });
});

app.get('/', (req, res) => {
  res.send('A szerver mukodik!');
});

const PORT = process.env.PORT || 5000;
// 6. FONTOS VÁLTOZÁS: app.listen helyett server.listen kell!
server.listen(PORT, () => {
  console.log(`🚀 A CHAT szerver fut a ${PORT}-es porton`);
});