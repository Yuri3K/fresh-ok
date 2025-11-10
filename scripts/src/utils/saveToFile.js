const fs = require('fs');
const path = require('path');

function saveJsonToFile(dir, filename, data) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const filePath = path.join(dir, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  return filePath;
}

module.exports = { saveJsonToFile };
