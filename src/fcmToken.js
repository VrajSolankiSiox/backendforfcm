const express = require('express');
const FcmToken = require('./models/FcmToken');

const router = express.Router();
 
router.post('/', async (req, res) => {
  try {
    const token = req.body?.token;
    if (!token || typeof token !== 'string') {
      return res.status(400).json({ ok: false, error: 'token is required' });
    }

    const existing = await FcmToken.findOne({ token });
    if (existing) return res.json({ ok: true, created: false });

    await FcmToken.create({ token });
    return res.json({ ok: true, created: true });
  } catch (err) { 
    if (err?.code === 11000) return res.json({ ok: true, created: false });
    return res.status(500).json({ ok: false, error: err?.message ?? 'Failed to save token' });
  }
});

module.exports = router;
