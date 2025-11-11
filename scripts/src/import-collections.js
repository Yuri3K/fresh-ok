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

const INPUT_DIR = './gpalette-uat/backups';
const PROGRESS_FILE = path.join(INPUT_DIR, 'progress-import.json');
const BATCH_SIZE = 500;

// ✅ Инициализация Firebase
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: PROJECT_ID,
  });
}

// ✅ Firestore SDK
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
// 📘 Работа с прогрессом
// ----------------------------------------------------
function loadProgress() {
  if (!fs.existsSync(PROGRESS_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
  } catch {
    console.warn('⚠️ progress-import.json повреждён. Начинаем заново.');
    return {};
  }
}

function saveProgress(progress) {
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

      // 🔁 Рекурсивно импортируем вложенные подколлекции
      if (__subcollections__) {
        await importSubcollections(subColRef.doc(docId), __subcollections__);
      }
    }
  }
}

// ----------------------------------------------------
// 📥 Импорт одной коллекции
// ----------------------------------------------------
async function importCollection(filePath, progress) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const json = JSON.parse(raw);
  const collectionName = Object.keys(json)[0];
  const data = json[collectionName];

  console.log(`📥 Importing collection: ${collectionName} (${Object.keys(data).length} documents)`);

  let batch = firestore.batch();
  let count = 0;

  for (const [docId, docData] of Object.entries(data)) {
    const { __subcollections__, ...plainData } = docData;
    const docRef = firestore.collection(collectionName).doc(docId);

    batch.set(docRef, plainData);
    count++;

    // Когда batch достигает лимита — коммитим
    if (count % BATCH_SIZE === 0) {
      await batch.commit();
      console.log(`⬆️  ${collectionName}: committed ${count} documents...`);
      batch = firestore.batch();

      progress[collectionName] = { done: false, count };
      saveProgress(progress);
    }

    // 🔁 После коммита подколлекций — рекурсивный импорт
    if (__subcollections__) {
      await importSubcollections(docRef, __subcollections__);
    }
  }

  if (count % BATCH_SIZE !== 0) {
    await batch.commit();
  }

  progress[collectionName] = { done: true, count };
  saveProgress(progress);

  console.log(`✅ Finished importing collection: ${collectionName} (${count} documents)\n`);
}

// ----------------------------------------------------
// 🚀 Импорт всех коллекций
// ----------------------------------------------------
async function importAllCollections() {
  console.log('🚀 Starting Firestore import...');
  const progress = loadProgress();

  const files = fs
    .readdirSync(INPUT_DIR)
    .filter(f => f.endsWith('.json') && !f.includes('progress'));

  for (const file of files) {
    const collectionName = path.basename(file, '.json');

    if (progress[collectionName]?.done) {
      console.log(`⏭️  Skipping ${collectionName} (already imported)`);
      continue;
    }

    await importCollection(path.join(INPUT_DIR, file), progress);
  }

  console.log('🎉 Import completed! All collections imported.');
  fs.unlinkSync(PROGRESS_FILE);
  console.log('🧹 progress-import.json removed.');
}

// ▶️ Запуск
importAllCollections().catch(console.error);
