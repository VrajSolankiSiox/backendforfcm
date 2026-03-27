const express = require('express');
const { sendNotification } = require('./sendnotification');

const router = express.Router();

// Minimal login endpoint for now:
// - accepts an FCM token from the device
// - sends a "Login successful" push notification to that token
router.post('/login', async (req, res) => {
  try {
    const { fcmToken } = req.body ?? {};
    if (!fcmToken) return res.status(400).json({ ok: false, error: 'fcmToken is required' });

    const messageId = await sendNotification({
      token: fcmToken,
      title: 'Login',
      body: 'Login successful',
      data: { type: 'login' },
    });

    return res.json({ ok: true, messageId });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message ?? 'Login failed' });
  }
});

module.exports = router;

