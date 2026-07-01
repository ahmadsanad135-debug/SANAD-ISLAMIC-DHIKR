// server/sendNotifications.js
// Helper using firebase-admin to send notifications and remove invalid tokens.
// Ensure admin.initializeApp(...) is done in your server startup.

const admin = require('firebase-admin');
// const serviceAccount = require('./path/to/serviceAccountKey.json');
// admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

async function sendToTokens(tokens, payload, TokensModel) {
  // tokens: array of unique tokens
  if (!tokens || tokens.length === 0) return;
  try {
    const response = await admin.messaging().sendToDevice(tokens, payload);
    const tokensToRemove = [];
    response.results.forEach((result, idx) => {
      const error = result.error;
      if (error) {
        console.error('Failure sending to', tokens[idx], error);
        // common errors: 'messaging/invalid-registration-token', 'messaging/registration-token-not-registered'
        tokensToRemove.push(tokens[idx]);
      }
    });
    if (tokensToRemove.length && TokensModel) {
      await TokensModel.deleteMany({ token: { $in: tokensToRemove } });
      console.log('Removed invalid tokens:', tokensToRemove.length);
    }
  } catch (err) {
    console.error('sendToDevice error', err);
  }
}

module.exports = { sendToTokens };
