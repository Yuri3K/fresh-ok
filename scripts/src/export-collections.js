const fs = require('fs');
const path = require('path');
const { firestore } = require('./utils/firestoreClient');
const { PROGRESS_FILE, loadProgress, OUTPUT_DIR } = require('./utils/progress');
const { exportSingleCollection } = require('./export-single-collection');

async function exportAllCollections() {
  console.log('🚀 Starting full Firestore export...');

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const progress = loadProgress();
  const collections = await firestore.listCollections();

  for (const col of collections) {
    const name = col.id;

    // ⏩ Пропускаем уже экспортированные коллекции
    if (progress[name]?.done) {
      console.log(`⏭️  Skipping ${name} (already exported)`);
      continue;
    }

    await exportSingleCollection(name);
  }

  console.log('\n🎉 Export completed! All collections saved in:');
  console.log(path.resolve(OUTPUT_DIR));

  // 🧹 Удаляем файл прогресса
  if (fs.existsSync(PROGRESS_FILE)) {
    fs.unlinkSync(PROGRESS_FILE);
    console.log('🧹 Progress file removed (all done).');
  }
}

if (require.main === module) {
  exportAllCollections().catch(console.error);
}

module.exports = { exportAllCollections };
