const express = require('express');

const router = express.Router();

// Receives driver location pings (demo)
// Body: { latitude: number, longitude: number }
router.post('/', (req, res) => {
  const { latitude, longitude } = req.body ?? {};
  console.log('Location ping:', latitude, longitude);
  res.json({ ok: true });
});

module.exports = router;

