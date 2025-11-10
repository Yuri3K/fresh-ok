const admin = require('firebase-admin');
const { restore } = require('firestore-export-import');
const fs = require('fs');

const serviceAccount = require('../../backend/src/freshok-market-firebase-adminsdk-fbsvc-d0313b7ad7.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://freshok-market.firebaseio.com',
  });
}

const firestore = admin.firestore();

// ✅ Читаем данные из файла
const data = JSON.parse(fs.readFileSync('./firestore-backup.json', 'utf8'));

// ✅ Восстанавливаем
restore(firestore, data)
  .then(() => {
    console.log('✅ Firestore successfully restored from backup');
  })
  .catch(err => {
    console.error('❌ Restore failed:', err);
  });