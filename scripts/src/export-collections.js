const admin = require('firebase-admin');
const { Firestore } = require('@google-cloud/firestore');
const fs = require('fs');
const path = require('path');

// 🔐 Сервисный аккаунт
const serviceAccount = require('../../backend/src/freshok-market-firebase-adminsdk-fbsvc-d0313b7ad7.json');
// const serviceAccount = require('../../backend/src/gpalette-uat-da7fef05dd53.json');


// ⚙️ Конфигурация
const PROJECT_ID = 'freshok-market';
const TARGET_DATABASE_ID = '(default)';


// const PROJECT_ID = 'gpalette-uat';
// const TARGET_DATABASE_ID = 'gpalette-import-2025-aug-15';


const OUTPUT_DIR = './src/gpalette-uat/backups'; // Папка для экспорта
const BATCH_SIZE = 1000;

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

// ----------------------------------------------------
// 🧩 Экспорт одной коллекции в отдельный JSON
// ----------------------------------------------------
async function exportCollection(collectionName, batchSize = BATCH_SIZE) {
  console.log(`📤 Exporting collection: ${collectionName}`);

  const data = {};
  let lastDoc = null;
  let total = 0;

  while (true) {
    let query = firestore.collection(collectionName).orderBy('__name__').limit(batchSize);
    if (lastDoc) query = query.startAfter(lastDoc);

    const snapshot = await query.get();
    if (snapshot.empty) break;

    for (const doc of snapshot.docs) {
      data[doc.id] = doc.data();
      total++;
    }

    lastDoc = snapshot.docs[snapshot.docs.length - 1];
    console.log(`⬇️  ${collectionName}: ${total} documents exported so far...`);
  }

  // 🗂️ Создаём папку, если её нет
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const filePath = path.join(OUTPUT_DIR, `${collectionName}.json`);
  fs.writeFileSync(filePath, JSON.stringify({ [collectionName]: data }, null, 2));

  console.log(`✅ Saved: ${filePath} (${total} documents)\n`);
}

// ----------------------------------------------------
// 🚀 Главная функция — экспорт всех коллекций
// ----------------------------------------------------
async function exportAllCollections() {
  console.log('🚀 Starting Firestore export...');
  const collections = await firestore.listCollections();

  for (const col of collections) {
    await exportCollection(col.id);
  }

  console.log('🎉 Export completed! All collections saved in:');
  console.log(path.resolve(OUTPUT_DIR));
}

// ▶️ Запуск
exportAllCollections().catch(console.error);
