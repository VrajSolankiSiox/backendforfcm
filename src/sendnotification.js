const express = require('express');
const { getMessaging } = require('./firebase');

const router = express.Router();

async function sendNotification({ token, title, body, data }) {
  if (!token) throw new Error('token is required');

  const message = {
    token,
    notification: {
      title: title ?? 'DriverApp',
      body: body ?? '',
    },
    data: data ?? {},
    android: {
      priority: 'high',
      notification: {
        channelId: 'default',
      },
    },
    apns: {
      headers: {
        'apns-priority': '10',
      },
    },
  };

  return getMessaging().send(message);
}

router.post('/', async (req, res) => {
  try {
    const { token, title, body, data } = req.body ?? {};
    const messageId = await sendNotification({ token, title, body, data });
    res.json({ ok: true, messageId });
  } catch (err) {
    res.status(500).json({ ok: false, error: err?.message ?? 'Failed to send notification' });
  }
});

module.exports = router;
module.exports.sendNotification = sendNotification;
