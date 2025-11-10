const admin = require('firebase-admin');
const { Firestore } = require('@google-cloud/firestore');
const fs = require('fs');
const path = require('path');

// 🔐 Сервисный аккаунт
const serviceAccount = require('../../backend/src/freshok-market-firebase-adminsdk-fbsvc-d0313b7ad7.json');

// ⚙️ Конфигурация
const PROJECT_ID = 'freshok-market';
const TARGET_DATABASE_ID = '(default)'; // для основной базы
const INPUT_DIR = './src/gpalette-uat/backups'; // папка с экспортом
const BATCH_SIZE = 500; // максимальный batch Firestore

// ✅ Инициализация Admin SDK
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

// ----------------------------------------------------
// 📥 Импорт одной коллекции
// ----------------------------------------------------
async function importCollection(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const json = JSON.parse(raw);
  const collectionName = Object.keys(json)[0];
  const data = json[collectionName];

  console.log(`📥 Importing collection: ${collectionName} (${Object.keys(data).length} documents)`);

  let batch = firestore.batch();
  let count = 0;

  for (const [docId, docData] of Object.entries(data)) {
    const docRef = firestore.collection(collectionName).doc(docId);
    batch.set(docRef, docData);
    count++;

    if (count % BATCH_SIZE === 0) {
      await batch.commit();
      console.log(`⬆️  Committed ${count} documents...`);
      batch = firestore.batch();
    }
  }

  if (count % BATCH_SIZE !== 0) {
    await batch.commit();
  }

  console.log(`✅ Finished importing collection: ${collectionName} (${count} documents)\n`);
}

// ----------------------------------------------------
// 🚀 Импорт всех коллекций из папки
// ----------------------------------------------------
async function importAllCollections() {
  const files = fs.readdirSync(INPUT_DIR).filter(f => f.endsWith('.json'));

  for (const file of files) {
    await importCollection(path.join(INPUT_DIR, file));
  }

  console.log('🎉 All collections imported!');
}

// ▶️ Запуск
importAllCollections().catch(console.error);
