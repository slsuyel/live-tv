const fs = require('fs');
const path = require('path');
const crypto = require('crypto').webcrypto;

const BASE_DOMAIN = "https://28js.livekhelatv.com";
const TARGET_URL = `${BASE_DOMAIN}/041a7e3d-71ce-400e-9327-7ef276752358`;
const PLAY_API_URL = `${BASE_DOMAIN}/v1/mks/channel`;

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

async function run() {
  try {
    console.log("Fetching channels page from:", TARGET_URL);
    const res = await fetch(TARGET_URL, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch page: status ${res.status}`);
    }
    const html = await res.text();
    const match = html.match(/const\s+CHANNELS\s*=\s*(\[[\s\S]*?\])\s*;/);
    if (!match) {
      throw new Error("Could not find CHANNELS array in the main page HTML.");
    }
    const channels = JSON.parse(match[1]);
    console.log(`Successfully parsed ${channels.length} channels.`);
    
    // Test fetch for first channel
    if (channels.length > 0) {
      const ch = channels[0];
      const params = new URLSearchParams();
      params.set("key", ch.key);
      params.set("access", ch.play_token);

      console.log(`Testing stream fetch for: [${ch.key}] ${ch.name}...`);
      const playRes = await fetch(PLAY_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          "Referer": TARGET_URL,
          "Origin": BASE_DOMAIN,
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        },
        body: params.toString()
      });

      if (!playRes.ok) {
        throw new Error(`Play API error: status ${playRes.status}`);
      }

      const json = await playRes.json();
      if (!json || !json.success) {
        throw new Error(`Play API success=false: ${json ? json.message : 'no response'}`);
      }

      const decrypted = await decodePayload(json.payload, ch.play_token);
      console.log("Decrypted stream details:", decrypted);
    }
  } catch (err) {
    console.error("Error in test script:", err.message);
  }
}

run();
