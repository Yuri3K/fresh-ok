const admin = require('firebase-admin');
const { Firestore } = require('@google-cloud/firestore');
const fs = require('fs');

// 🔐 Сервисный аккаунт
const serviceAccount = require('../../backend/src/gpalette-uat-da7fef05dd53.json');

const PROJECT_ID = 'gpalette-uat';
const TARGET_DATABASE_ID = 'gpalette-import-2025-aug-15';
const COLLECTION_NAME = 'assetStatuses';
const OUTPUT_FILE = './src/gpalette-uat/assetStatuses.json';

// ✅ Инициализируем Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: PROJECT_ID,
  });
}

// ✅ Подключаем Firestore через Google Cloud SDK (для указания custom DB)
const firestore = new Firestore({
  projectId: PROJECT_ID,
  databaseId: TARGET_DATABASE_ID,
  credentials: {
    client_email: serviceAccount.client_email,
    private_key: serviceAccount.private_key.replace(/\\n/g, '\n'),
  },
});

console.log(`✅ Connected to project: ${PROJECT_ID}, database: ${firestore.databaseId}`);

// ----------------------------------------------------
// 📦 Экспорт коллекции в структуру Firestore Import
// ----------------------------------------------------
async function exportCollectionForImport(collectionName, outputFile, batchSize = 1000) {
  const output = { [collectionName]: {} };
  let lastDoc = null;
  let totalCount = 0;

  while (true) {
    let query = firestore.collection(collectionName).orderBy('__name__').limit(batchSize);
    if (lastDoc) query = query.startAfter(lastDoc);

    const snapshot = await query.get();
    if (snapshot.empty) break;

    for (const doc of snapshot.docs) {
      output[collectionName][doc.id] = doc.data();
      totalCount++;
    }

    lastDoc = snapshot.docs[snapshot.docs.length - 1];
    console.log(`⬇️  Exported ${totalCount} documents so far...`);
  }

  fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));
  console.log(`✅ Export finished. Total documents: ${totalCount}`);
  console.log(`📁 Saved to: ${outputFile}`);
}

// 🚀 Запуск экспорта
exportCollectionForImport(COLLECTION_NAME, OUTPUT_FILE).catch(console.error);
