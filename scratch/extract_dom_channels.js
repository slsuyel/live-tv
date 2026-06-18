const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'ugby_page.html');
const html = fs.readFileSync(htmlPath, 'utf8');

// Let's search for channel-card divs or buttons
// Example: <button class="channel-card..." data-key="..." data-category="..."> ...
// Let's find matches of data-key
const regex = /data-key="([^"]+)"/g;
const keys = new Set();
let match;
while ((match = regex.exec(html)) !== null) {
  keys.add(match[1]);
}

console.log("Total unique channel keys found:", keys.size);
console.log("Keys:", Array.from(keys));

// Let's do a more structured extraction of the channel cards
// Find the div/button tag that contains data-key
const cardRegex = /<button\b[^>]*data-key="([^"]+)"[^>]*>([\s\S]*?)<\/button>/gi;
const channels = [];

while ((match = cardRegex.exec(html)) !== null) {
  const key = match[1];
  const innerHtml = match[2];
  
  // Extract name
  const nameMatch = innerHtml.match(/class="channel-name"[^>]*>([\s\S]*?)<\/span>/i);
  const name = nameMatch ? nameMatch[1].trim() : '';

  // Extract logo
  const logoMatch = innerHtml.match(/<img\b[^>]*src="([^"]+)"/i);
  const logo = logoMatch ? logoMatch[1] : '';

  // Extract other data attributes from the button tag itself
  const buttonTag = match[0].split('>')[0];
  const categoryMatch = buttonTag.match(/data-category="([^"]+)"/i);
  const category = categoryMatch ? categoryMatch[1] : '';

  const playTokenMatch = buttonTag.match(/data-play-token="([^"]+)"/i);
  const playToken = playTokenMatch ? playTokenMatch[1] : '';

  channels.push({
    key,
    name,
    logo,
    category,
    play_token: playToken
  });
}

console.log(`Extracted ${channels.length} channel cards from the DOM:`);
console.log(JSON.stringify(channels.slice(0, 10), null, 2));

// Save them
fs.writeFileSync(path.join(__dirname, 'extracted_channels.json'), JSON.stringify(channels, null, 2), 'utf8');
console.log("Saved to scratch/extracted_channels.json");
