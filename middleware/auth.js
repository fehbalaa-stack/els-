const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // 1. Megnézzük, van-e token a fejlécben
  const token = req.header('x-auth-token');

  // Ha nincs token, nem engedjük tovább
  if (!token) {
    return res.status(401).json({ msg: 'Nincs token, hozzáférés megtagadva!' });
  }

  // 2. Ha van, ellenőrizzük, hogy érvényes-e
  try {
    const decoded = jwt.verify(token, "TITKOS_KULCS_123");
    req.user = decoded; // Betesszük a user adatait a kérésbe
    next(); // Mehet tovább a kérés a céljához
  } catch (err) {
    res.status(401).json({ msg: 'A token érvénytelen!' });
  }
};