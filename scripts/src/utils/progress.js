const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = './gpalette-uat/backups';
const PROGRESS_FILE = path.join(OUTPUT_DIR, 'progress.json');

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

module.exports = { OUTPUT_DIR, PROGRESS_FILE, loadProgress, saveProgress };
