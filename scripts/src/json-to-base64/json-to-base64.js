// node encode-sa-to-env.js /path/to/sa.json
const fs = require('fs'); // Импортируем модуль 'fs' для работы с файловой системой (чтение/запись файлов)

// Получаем аргументы командной строки
// process.argv — массив: [путь к node, путь к скрипту, остальные аргументы]
// Здесь мы берем третий элемент массива — путь к JSON-файлу сервисного аккаунта (sa = service account)
const [,, saPath] = process.argv;

// Если путь к файлу не указан, выбрасываем ошибку и показываем пример использования
if (!saPath) throw new Error('Usage: node encode-sa-to-env.js path/to/service-account.json');

// Читаем содержимое JSON-файла в виде строки
const json = fs.readFileSync(saPath, 'utf8');

// Кодируем содержимое JSON в base64
// Buffer.from(json, 'utf8') — создаем буфер из строки UTF-8
// .toString('base64') — преобразуем буфер в base64-строку
const b64 = Buffer.from(json, 'utf8').toString('base64');

// Путь к файлу .env в текущей директории
const envPath = '.env';

// Инициализируем переменную для содержимого .env
let env = '';

// Если файл .env существует, читаем его содержимое
if (fs.existsSync(envPath)) env = fs.readFileSync(envPath, 'utf8');

// Разбиваем содержимое на строки, фильтруем все строки, которые начинаются с SERVICE_ACCOUNT=
// Это нужно, чтобы удалить старое значение SERVICE_ACCOUNT, если оно уже есть
env = env.split(/\r?\n/).filter(line => !line.startsWith('SERVICE_ACCOUNT=')).join('\n');

// Если после фильтрации файл не пустой и не заканчивается переносом строки — добавляем его
if (env.length && !env.endsWith('\n')) env += '\n';

// Добавляем новую строку с SERVICE_ACCOUNT= и закодированным JSON
env += `SERVICE_ACCOUNT=${b64}\n`;

// Записываем обновленное содержимое обратно в .env
fs.writeFileSync(envPath, env, 'utf8');

// Выводим в консоль сообщение, что операция выполнена
console.log('Wrote SERVICE_ACCOUNT to .env');