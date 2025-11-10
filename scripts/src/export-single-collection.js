const { firestore } = require('./utils/firestoreClient');
const { OUTPUT_DIR, loadProgress, saveProgress } = require('./utils/progress');
const { saveJsonToFile } = require('./utils/saveToFile');

const BATCH_SIZE = 1000;

/**
 * Экспортирует одну коллекцию из Firestore в JSON-файл.
 * @param {string} collectionName - имя коллекции Firestore
 * @param {number} batchSize - размер пакета при загрузке документов
 */
async function exportSingleCollection(collectionName, batchSize = BATCH_SIZE) {
  console.log(`📤 Starting export for collection: ${collectionName}`);

  const progress = loadProgress();
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

    console.log(`⬇️  ${collectionName}: ${total} docs exported so far...`);
  }

  // 📁 Сохраняем итоговый файл
  const filePath = saveJsonToFile(OUTPUT_DIR, `${collectionName}.json`, { [collectionName]: data });

  // ✅ Отмечаем завершение
  progress[collectionName] = { done: true, count: total };
  saveProgress(progress);

  console.log(`✅ Export completed: ${filePath} (${total} documents)\n`);
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
    .then(() => console.log('🎉 Export finished successfully.'))
    .catch((err) => {
      console.error('❌ Export failed:', err);
      process.exit(1);
    });
}

module.exports = { exportSingleCollection };
