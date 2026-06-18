const fs = require('fs');
const path = require('path');

const scriptPath = path.join(__dirname, 'block4.js');
const js = fs.readFileSync(scriptPath, 'utf8');

console.log("JS length:", js.length);

// Let's find "dsports" in the script and print surrounding text
const idx = js.indexOf('dsports');
if (idx !== -1) {
  console.log("Found 'dsports' at index:", idx);
  console.log("Surrounding code:");
  console.log(js.slice(Math.max(0, idx - 200), idx + 2000));
} else {
  console.log("Could not find 'dsports' in block4.js");
}
