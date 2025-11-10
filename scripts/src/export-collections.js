const admin = require('firebase-admin');
const { Firestore } = require('@google-cloud/firestore');
const fs = require('fs');
const path = require('path');

// 🔐 Сервисный аккаунт
const serviceAccount = require('../../backend/src/gpalette-uat-da7fef05dd53.json');

// ⚙️ Конфигурация
const PROJECT_ID = 'gpalette-uat';
const TARGET_DATABASE_ID = 'gpalette-import-2025-aug-15';
const OUTPUT_DIR = './src/gpalette-uat/backups'; // Папка для экспорта
const PROGRESS_FILE = path.join(OUTPUT_DIR, 'progress.json');
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
// 📘 Работа с файлом прогресса
// ----------------------------------------------------
function loadProgress() {
  if (!fs.existsSync(PROGRESS_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8'));
  } catch {
    console.warn('⚠️ Progress file corrupted. Starting fresh.');
    return {};
  }
}

function saveProgress(progress) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

// ----------------------------------------------------
// 🧩 Экспорт одной коллекции
// ----------------------------------------------------
async function exportCollection(collectionName, progress, batchSize = BATCH_SIZE) {
  console.log(`📤 Exporting collection: ${collectionName}`);

  const data = {};
  let lastDoc = null;
  let total = progress[collectionName]?.count || 0;

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

    // 💾 Сохраняем промежуточный прогресс
    progress[collectionName] = { done: false, count: total };
    saveProgress(progress);

    console.log(`⬇️  ${collectionName}: ${total} documents exported so far...`);
  }

  // 🗂️ Создаём папку, если её нет
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const filePath = path.join(OUTPUT_DIR, `${collectionName}.json`);
  fs.writeFileSync(filePath, JSON.stringify({ [collectionName]: data }, null, 2));

  // ✅ Отмечаем коллекцию как завершённую
  progress[collectionName] = { done: true, count: total };
  saveProgress(progress);

  console.log(`✅ Saved: ${filePath} (${total} documents)\n`);
}

// ----------------------------------------------------
// 🚀 Главная функция — экспорт всех коллекций
// ----------------------------------------------------
async function exportAllCollections() {
  console.log('🚀 Starting Firestore export...');
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const progress = loadProgress();
  const collections = await firestore.listCollections();

  for (const col of collections) {
    const name = col.id;

    // ⏩ Пропускаем, если коллекция уже экспортирована
    if (progress[name]?.done) {
      console.log(`⏭️  Skipping ${name} (already exported)`);
      continue;
    }

    await exportCollection(name, progress);
  }

  console.log('\n🎉 Export completed! All collections saved in:');
  console.log(path.resolve(OUTPUT_DIR));

  // Удаляем файл прогресса после успешного завершения
  fs.unlinkSync(PROGRESS_FILE);
  console.log('🧹 Progress file removed (all done).');
}

// ▶️ Запуск
exportAllCollections().catch(console.error);
