const { firestore } = require('./utils/firestoreClient');
const { OUTPUT_DIR, loadProgress, saveProgress, PROGRESS_FILE } = require('./utils/progress');
const { saveJsonToFile } = require('./utils/saveToFile');
const path = require('path');
const fs = require('fs');

const BATCH_SIZE = 1000;

/**
 * 📦 Экспортирует одну коллекцию Firestore (включая подколлекции)
 * @param {string} collectionName - Имя коллекции
 * @param {string} [parentPath] - Путь родителя (если это подколлекция)
 */
async function exportSingleCollection(collectionName, parentPath = '', batchSize = BATCH_SIZE) {
  const fullPath = parentPath ? `${parentPath}/${collectionName}` : collectionName;
  console.log(`📤 Exporting collection: ${fullPath}`);

    // 🧩 Создаём директорию, если её нет
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // 🧩 Создаём progress.json, если его нет
  const progressDir = path.dirname(PROGRESS_FILE);
  if (!fs.existsSync(progressDir)) {
    fs.mkdirSync(progressDir, { recursive: true });
  }
  if (!fs.existsSync(PROGRESS_FILE)) {
    fs.writeFileSync(PROGRESS_FILE, '{}');
  }

  const progress = loadProgress();
  const data = {};
  let lastDoc = null;
  let total = progress[fullPath]?.count || 0;

  while (true) {
    let query = firestore.collection(fullPath).orderBy('__name__').limit(batchSize);
    if (lastDoc) query = query.startAfter(lastDoc);

    const snapshot = await query.get();
    if (snapshot.empty) break;

    for (const doc of snapshot.docs) {
      const docId = doc.id;
      const docData = doc.data();

      // 🔁 Рекурсивно экспортируем подколлекции документа
      const subcollections = await doc.ref.listCollections();
      if (subcollections.length > 0) {
        docData.__subcollections__ = {};
        for (const sub of subcollections) {
          docData.__subcollections__[sub.id] = await exportSubcollection(sub, fullPath, docId);
        }
      }

      data[docId] = docData;
      total++;
    }

    lastDoc = snapshot.docs[snapshot.docs.length - 1];
    progress[fullPath] = { done: false, count: total };
    saveProgress(progress);
    console.log(`⬇️  ${fullPath}: ${total} documents exported so far...`);
  }

  // 💾 Сохраняем файл
  const folderPath = path.join(OUTPUT_DIR, parentPath || '');
  const filePath = saveJsonToFile(folderPath, `${collectionName}.json`, { [collectionName]: data });

  progress[fullPath] = { done: true, count: total };
  saveProgress(progress);
  console.log(`✅ Saved: ${filePath} (${total} documents)\n`);

  return data;
}

/**
 * 📦 Экспортирует подколлекцию для конкретного документа
 * @param {FirebaseFirestore.CollectionReference} subCollectionRef
 * @param {string} parentPath
 * @param {string} docId
 */
async function exportSubcollection(subCollectionRef, parentPath, docId) {
  const subName = subCollectionRef.id;
  const subPath = `${parentPath}/${docId}/${subName}`;
  const data = {};
  let lastDoc = null;

  while (true) {
    let query = subCollectionRef.orderBy('__name__').limit(BATCH_SIZE);
    if (lastDoc) query = query.startAfter(lastDoc);

    const snapshot = await query.get();
    if (snapshot.empty) break;

    for (const doc of snapshot.docs) {
      const docData = doc.data();

      // 🔁 Проверяем вложенные подколлекции
      const nestedSubs = await doc.ref.listCollections();
      if (nestedSubs.length > 0) {
        docData.__subcollections__ = {};
        for (const nested of nestedSubs) {
          docData.__subcollections__[nested.id] = await exportSubcollection(nested, subPath, doc.id);
        }
      }

      data[doc.id] = docData;
    }

    lastDoc = snapshot.docs[snapshot.docs.length - 1];
  }

  return data;
}

// --- CLI запуск ---
// node scripts/exportSingleCollection.js users
if (require.main === module) {
  const collectionName = process.argv[2];
  if (!collectionName) {
    console.error('❌ Please provide a collection name. Example: node scripts/exportSingleCollection.js users');
    process.exit(1);
  }

  exportSingleCollection(collectionName)
    .then(() => console.log('🎉 Export finished successfully (with subcollections).'))
    .catch((err) => {
      console.error('❌ Export failed:', err);
      process.exit(1);
    });
}

module.exports = { exportSingleCollection };
