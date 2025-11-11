const { Firestore } = require('@google-cloud/firestore');
const admin = require('firebase-admin');
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

const INPUT_DIR = './gpalette-uat/backups';
const PROGRESS_FILE = path.join(INPUT_DIR, 'progress-import.json');
const BATCH_SIZE = 500;

// ✅ Firebase
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: PROJECT_ID,
  });
}

// ✅ Firestore
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
// 📘 Прогресс
// ----------------------------------------------------
function ensureProgressFile() {
  const dir = path.dirname(PROGRESS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(PROGRESS_FILE)) fs.writeFileSync(PROGRESS_FILE, '{}');
}

function loadProgress() {
  ensureProgressFile();
  try {
    return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
  } catch {
    console.warn('⚠️ progress-import.json повреждён. Начинаем заново.');
    return {};
  }
}

function saveProgress(progress) {
  ensureProgressFile();
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

// ----------------------------------------------------
// 📥 Импорт подколлекций (рекурсивно)
// ----------------------------------------------------
async function importSubcollections(parentDocRef, subcollections) {
  for (const [subName, subData] of Object.entries(subcollections)) {
    const subColRef = parentDocRef.collection(subName);

    console.log(`📂 Importing subcollection: ${parentDocRef.path}/${subName} (${Object.keys(subData).length} docs)`);

    for (const [docId, docData] of Object.entries(subData)) {
      const { __subcollections__, ...plainData } = docData;
      await subColRef.doc(docId).set(plainData);

      if (__subcollections__) {
        await importSubcollections(subColRef.doc(docId), __subcollections__);
      }
    }
  }
}

// ----------------------------------------------------
// 📥 Импорт одной коллекции (включая подколлекции)
// ----------------------------------------------------
async function importSingleCollection(collectionName, batchSize = BATCH_SIZE) {
  const filePath = path.join(INPUT_DIR, `${collectionName}.json`);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Файл ${filePath} не найден`);
    process.exit(1);
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  const json = JSON.parse(raw);
  const data = json[collectionName];

  console.log(`📥 Importing collection: ${collectionName} (${Object.keys(data).length} documents)`);

  const progress = loadProgress();

  let batch = firestore.batch();
  let count = 0;

  for (const [docId, docData] of Object.entries(data)) {
    const { __subcollections__, ...plainData } = docData;
    const docRef = firestore.collection(collectionName).doc(docId);

    batch.set(docRef, plainData);
    count++;

    if (count % batchSize === 0) {
      await batch.commit();
      console.log(`⬆️  ${collectionName}: committed ${count} documents...`);
      batch = firestore.batch();

      progress[collectionName] = { done: false, count };
      saveProgress(progress);
    }

    if (__subcollections__) {
      await importSubcollections(docRef, __subcollections__);
    }
  }

  if (count % batchSize !== 0) {
    await batch.commit();
  }

  progress[collectionName] = { done: true, count };
  saveProgress(progress);

  console.log(`✅ Finished importing collection: ${collectionName} (${count} documents)\n`);
}

// --- CLI запуск ---
// node src/import-single-collection.js users
if (require.main === module) {
  const collectionName = process.argv[2];
  if (!collectionName) {
    console.error('❌ Please provide a collection name. Example: node src/import-single-collection.js users');
    process.exit(1);
  }

  importSingleCollection(collectionName)
    .then(() => {
      console.log('🎉 Import finished successfully (with subcollections).');
    })
    .catch((err) => {
      console.error('❌ Import failed:', err);
      process.exit(1);
    });
}

module.exports = { importSingleCollection };
