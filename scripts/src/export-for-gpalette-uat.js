const { backup } = require('firestore-export-import');
const admin = require('firebase-admin');
const fs = require('fs');

// ❗ Добавление библиотеки Google Cloud Firestore
const Firestore = require('@google-cloud/firestore');

// ✅ Загружаем сервисный аккаунт
const serviceAccount = require('../../backend/src/gpalette-uat-da7fef05dd53.json');
const TARGET_DATABASE_ID = 'gpalette-import-2025-aug-15'; 
const PROJECT_ID = 'gpalette-uat'; // Используем ID проекта

// ✅ Инициализируем Firebase
if (!admin.apps.length) {
    admin.initializeApp({
        // Используем явный сертификат, т.к. вы его загружаете
        credential: admin.credential.cert(serviceAccount), 
        projectId: PROJECT_ID,
    });
}

// ----------------------------------------------------
// 🎯 ГЛАВНОЕ ИЗМЕНЕНИЕ: Подключение через @google-cloud/firestore
// ----------------------------------------------------
const firestore = new Firestore({ 
    projectId: PROJECT_ID, // Обязательно указываем проект
    databaseId: TARGET_DATABASE_ID, // Указываем целевую БД
    credentials: {
        client_email: serviceAccount.client_email,
        private_key: serviceAccount.private_key.replace(/\\n/g, '\n'),
    },
});

console.log(` ✅ Connected to project: ${PROJECT_ID}, target database: ${firestore.databaseId}`);


// 1. Тест подключения (Проверка ID)
firestore.collection('assetStatuses').limit(1).get()
  .then(snapshot => {
    console.log(`Successfully read ${snapshot.size} document(s) from DB ID: ${firestore.databaseId}`);
  })
  .catch(error => {
    console.error("Connection Test Error:", error);
  });

// 2. Делаем бэкап нужной коллекции
// Примечание: Библиотека 'firestore-export-import' принимает объект, который ведет себя как Admin SDK.
// Поскольку @google-cloud/firestore имеет тот же API (collection, get, etc.), это должно работать.
backup(firestore, 'assetStatuses')
  .then(data => {
    fs.writeFileSync('./assetStatuses.json', JSON.stringify(data, null, 2));
    console.log('✅ Backup of assetStatuses saved');
  })
  .catch(console.error);