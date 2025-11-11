const { Storage } = require('@google-cloud/storage');
const fs = require('fs');
const path = require('path');

// 🔐 Путь к сервисному аккаунту
const serviceAccount = require('../../backend/src/gpalette-uat-da7fef05dd53.json');

// ⚙️ Настройки
const BUCKET_NAME = 'files-2025-aug-15-uat';       // имя бакета
const OUTPUT_DIR = './backups/images';        // локальная папка для сохранения

// ✅ Инициализация клиента
const storage = new Storage({
  projectId: serviceAccount.project_id,
  credentials: {
    client_email: serviceAccount.client_email,
    private_key: serviceAccount.private_key.replace(/\\n/g, '\n'),
  },
});

async function downloadBucket() {
  console.log(`📥 Starting download of bucket: ${BUCKET_NAME}`);

  // Получаем все файлы из бакета
  const [files] = await storage.bucket(BUCKET_NAME).getFiles();

for (const file of files) {
  let filePath = path.join(OUTPUT_DIR, file.name);

  // Проверяем, что путь не оканчивается на "/" (GCS "директории")
  if (file.name.endsWith('/')) continue;

  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  // Если файл не имеет расширения, добавляем ".bin"
  if (!path.extname(filePath)) filePath += '.bin';

  try {
    await file.download({ destination: filePath });
    console.log(`✅ Downloaded: ${file.name}`);
  } catch (err) {
    console.error(`❌ Failed to download ${file.name}:`, err.message);
  }
}

  console.log(`🎉 All files downloaded to: ${path.resolve(OUTPUT_DIR)}`);
}

// ▶️ Запуск
downloadBucket().catch(err => {
  console.error('❌ Download failed:', err);
  process.exit(1);
});
