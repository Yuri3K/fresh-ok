const admin = require('firebase-admin');
const { backups } = require('firestore-export-import'); // 👈 важно: backups, не backup
const fs = require('fs');

// ✅ Загружаем сервисный аккаунт
// const serviceAccount = require('../../backend/src/freshok-market-firebase-adminsdk-fbsvc-d0313b7ad7.json');
const serviceAccount = require('../../backend/src/gpalette-uat-da7fef05dd53.json');

// ✅ Инициализируем Firebase
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://freshok-market.firebaseio.com',
  });
}

const firestore = admin.firestore();

// ✅ Делаем бэкап всех коллекций
backups(firestore)
  .then(data => {
    fs.writeFileSync('./firestore-backup.json', JSON.stringify(data, null, 2));
    console.log('✅ Backup saved to firestore-backup.json');
  })
  .catch(err => {
    console.error('❌ Backup failed:', err);
  });