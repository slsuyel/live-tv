const fs = require('fs');
const path = require('path');

const scriptPath = path.join(__dirname, 'block4.js');
const js = fs.readFileSync(scriptPath, 'utf8');

const match = js.match(/const\s+CHANNELS\s*=\s*(\[[\s\S]*?\])\s*;/);
if (match) {
  try {
    const channels = JSON.parse(match[1]);
    console.log(`Successfully parsed ${channels.length} channels.`);
    fs.writeFileSync(path.join(__dirname, 'channels.json'), JSON.stringify(channels, null, 2), 'utf8');
    console.log('Saved channels to scratch/channels.json');
  } catch (err) {
    console.error('Error parsing JSON:', err.message);
  }
} else {
  console.log('CHANNELS pattern not found');
}
