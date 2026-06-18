const fs = require('fs');
const path = require('path');
const crypto = require('crypto').webcrypto;

const channels = JSON.parse(fs.readFileSync(path.join(__dirname, 'channels.json'), 'utf8'));
const PLAY_API_URL = "https://ugby.livekhelatv.com/v1/mks/channel";

function mlbdB64UrlToBytes(value) {
  try {
    let s = String(value || "").replace(/-/g, "+").replace(/_/g, "/");
    while (s.length % 4) s += "=";
    const bin = Buffer.from(s, 'base64').toString('binary');
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  } catch (e) {
    return new Uint8Array(0);
  }
}

async function decodePayload(payload, accessToken) {
  try {
    if (typeof payload === "string") {
      const reversed = String(payload || "").split("").reverse().join("");
      return JSON.parse(Buffer.from(reversed, 'base64').toString('utf8'));
    }
    if (payload && payload.legacy && payload.data) {
      const reversed = String(payload.data || "").split("").reverse().join("");
      return JSON.parse(Buffer.from(reversed, 'base64').toString('utf8'));
    }
    if (!payload || Number(payload.v || 0) !== 2) return null;
    const enc = new TextEncoder();
    const keyBytes = await crypto.subtle.digest("SHA-256", enc.encode(String(accessToken || "") + "|mlbd-web-stream-v2"));
    const key = await crypto.subtle.importKey("raw", keyBytes, { name: "AES-GCM" }, false, ["decrypt"]);
    const iv = mlbdB64UrlToBytes(payload.iv);
    const ct = mlbdB64UrlToBytes(payload.ct);
    const tag = mlbdB64UrlToBytes(payload.tag);
    if (!iv.length || !ct.length || !tag.length) return null;
    const packed = new Uint8Array(ct.length + tag.length);
    packed.set(ct, 0);
    packed.set(tag, ct.length);
    const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: iv, tagLength: 128 }, key, packed);
    return JSON.parse(new TextDecoder().decode(plain));
  } catch (e) {
    console.error('Decryption error:', e.message);
    return null;
  }
}

async function fetchChannel(ch) {
  const params = new URLSearchParams();
  params.set("key", ch.key);
  params.set("access", ch.play_token);

  console.log(`Fetching stream for: [${ch.key}] ${ch.name}...`);
  try {
    const res = await fetch(PLAY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        "Referer": "https://ugby.livekhelatv.com/041a7e3d-71ce-400e-9327-7ef276752358",
        "Origin": "https://ugby.livekhelatv.com",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      },
      body: params.toString()
    });

    if (!res.ok) {
      console.error(`- HTTP error ${res.status} for ${ch.key}`);
      return null;
    }

    const json = await res.json();
    if (!json || !json.success) {
      console.error(`- API error for ${ch.key}:`, json ? json.message : 'no response');
      return null;
    }

    const payload = await decodePayload(json.payload, ch.play_token);
    if (!payload) {
      console.error(`- Decryption failed for ${ch.key}`);
      return null;
    }

    return Object.assign({}, ch, payload);
  } catch (err) {
    console.error(`- Fetch error for ${ch.key}:`, err.message);
    return null;
  }
}

async function run() {
  const results = [];
  for (const ch of channels) {
    const res = await fetchChannel(ch);
    if (res) {
      console.log(`  -> URL: ${res.url}`);
      results.push(res);
    }
    // Small delay to prevent rate limit
    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`Successfully fetched and decrypted streams for ${results.length}/${channels.length} channels.`);
  fs.writeFileSync(path.join(__dirname, 'channels_with_streams.json'), JSON.stringify(results, null, 2), 'utf8');
}

run();
