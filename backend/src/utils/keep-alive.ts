import https from 'https';

const URL = 'https://fresh-ok.onrender.com/api/langs';
const INTERVAL = 10 * 60 * 1000; // 10 минут

export function startKeepAlive() {
  // Первый пинг сразу
  pingServer();

  // Далее каждые 10 минут
  setInterval(pingServer, INTERVAL);
}

function pingServer() {
  https.get(URL, (res) => {
    console.log(`[Keep-Alive] Ping sent at ${new Date().toISOString()} - Status: ${res.statusCode}`);
    // Проглатываем данные, чтобы поток закрыть
    res.on('data', () => {});
    res.on('end', () => {});
  }).on('error', (err) => {
    console.error(`[Keep-Alive] Ping failed at ${new Date().toISOString()} - Error:`, err.message);
  });
}