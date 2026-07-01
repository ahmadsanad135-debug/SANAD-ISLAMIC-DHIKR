// server/routes/pushTokens.js
// Express routes to save/delete tokens. Adjust paths/middleware to your project.

const express = require('express');
const router = express.Router();
const Tokens = require('../models/tokens');

router.post('/save-token', async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).send('no token');
  try {
    await Tokens.updateOne({ token }, { $set: { token, createdAt: new Date() } }, { upsert: true });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).send('server error');
  }
});

router.post('/delete-token', async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).send('no token');
  try {
    await Tokens.deleteOne({ token });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).send('server error');
  }
});

module.exports = router;
