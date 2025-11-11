const admin = require('firebase-admin');
const { Firestore } = require('@google-cloud/firestore');
const path = require('path');

// 🔐 Сервисный аккаунт
// const serviceAccount = require('../../../backend/src/freshok-market-firebase-adminsdk-fbsvc-d0313b7ad7.json');
// const serviceAccount = require('../../../backend/src/gpalette-uat-da7fef05dd53.json');
const serviceAccount = require('../../../backend/src/sonorous-summer-364413-c2aa27d8ec6c.json');

// ⚙️ Конфигурация
// const PROJECT_ID = 'freshok-market';
// const TARGET_DATABASE_ID = '(default)';

const PROJECT_ID = 'sonorous-summer-364413';
const TARGET_DATABASE_ID = '(default)';
// const PROJECT_ID = 'gpalette-uat';
// const TARGET_DATABASE_ID = 'gpalette-import-2025-aug-15';

// ✅ Инициализация Firebase
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: PROJECT_ID,
  });
}

// ✅ Инициализация Firestore SDK
const firestore = new Firestore({
  projectId: PROJECT_ID,
  databaseId: TARGET_DATABASE_ID,
  credentials: {
    client_email: serviceAccount.client_email,
    private_key: serviceAccount.private_key.replace(/\\n/g, '\n'),
  },
});

console.log(`✅ Connected to Firestore: project=${PROJECT_ID}, database=${firestore.databaseId}`);

module.exports = { firestore };
