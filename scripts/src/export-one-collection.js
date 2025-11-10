const { backup } = require('firestore-export-import');
const admin = require('firebase-admin');
const fs = require('fs');

// ✅ Загружаем сервисный аккаунт
const serviceAccount = require('../../backend/src/freshok-market-firebase-adminsdk-fbsvc-d0313b7ad7.json');

// ✅ Инициализируем Firebase
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://freshok-market.firebaseio.com',
  });
}

const firestore = admin.firestore();
backup(firestore, 'langs')
  .then(data => {
    fs.writeFileSync('./langs.json', JSON.stringify(data, null, 2));
    console.log('✅ Backup of langs saved');
  })
  .catch(console.error);