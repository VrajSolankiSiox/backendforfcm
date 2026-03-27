const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

let app;

function parseServiceAccount(value) {
  if (!value) return null;
  if (typeof value === 'object') return value;
  if (typeof value !== 'string') return null;

  let trimmed = value.trim();
  if (!trimmed) return null;

  // dotenv sometimes keeps surrounding quotes; strip a single matching pair.
  if (
    (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
    (trimmed.startsWith('"') && trimmed.endsWith('"'))
  ) {
    trimmed = trimmed.slice(1, -1).trim();
  }
  if (trimmed === '[object Object]') {
    throw new Error(
      'Service account value is "[object Object]". Provide a JSON string (or base64 JSON), not an object string.',
    );
  }

  const jsonString =
    trimmed.startsWith('{') ? trimmed : Buffer.from(trimmed, 'base64').toString('utf8').trim();

  try {
    return JSON.parse(jsonString);
  } catch (err) { 
    const normalized = jsonString.replace(/\r?\n/g, '\\n');
    return JSON.parse(normalized);
  }
}

function initFirebase() {
  if (app) return app;

  try {
    const envJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    const credsFromEnv = parseServiceAccount(envJson);
    if (credsFromEnv) {
      app = admin.initializeApp({ credential: admin.credential.cert(credsFromEnv) });
      return app;
    }
  } catch (err) {
    throw new Error(
      `Firebase Admin credentials invalid. Details: ${err?.message ?? err}`,
    );
  }

  // Auto-detect a local Firebase Admin service account json inside this folder (if present).
  try {
    const files = fs.readdirSync(__dirname);
    const candidate = files.find(
      (f) =>
        f.endsWith('.json') &&
        f !== 'google-services.json' &&
        f.includes('firebase-adminsdk'),
    );
    if (candidate) {
      // eslint-disable-next-line global-require
      const localCreds = require(path.join(__dirname, candidate));
      app = admin.initializeApp({ credential: admin.credential.cert(localCreds) });
      return app;
    }
  } catch (err) {
    // ignore and fall through to other options
  }

  const serviceAccountPath =  process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (serviceAccountPath) {
    app = admin.initializeApp({ credential: admin.credential.applicationDefault() });
    return app;
  }

  throw new Error(
    'Firebase admin not configured. Set FIREBASE_SERVICE_ACCOUNT_JSON or GOOGLE_APPLICATION_CREDENTIALS.',
  );
}

function getMessaging() {
  initFirebase();
  return admin.messaging();
}

module.exports = { getMessaging };
