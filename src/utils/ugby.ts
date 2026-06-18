import { Buffer } from "buffer";

export interface UgbyChannel {
  key: string;
  name: string;
  image: string;
  category: string;
  quality: string;
  status: string;
  sort: number;
  play_token: string;
  play_exp: number;
  source_types: string[];
}

export interface DecryptedStream {
  url: string;
  type: string;
  drm: string;
  key_id?: string;
  key_value?: string;
}

function mlbdB64UrlToBytes(value: string): Uint8Array {
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

export async function decodePayload(payload: any, accessToken: string): Promise<any> {
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
    const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: iv as any, tagLength: 128 }, key, packed as any);
    return JSON.parse(new TextDecoder().decode(plain));
  } catch (e: any) {
    console.error('decodePayload decryption error:', e.message);
    return null;
  }
}

export async function fetchUgbyChannels(): Promise<UgbyChannel[]> {
  const targetUrl = "https://ugby.livekhelatv.com/041a7e3d-71ce-400e-9327-7ef276752358";
  try {
    const res = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      },
      next: { revalidate: 60 } // Cache list for 60 seconds
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch main page: status ${res.status}`);
    }
    const html = await res.text();
    // Extract the CHANNELS array from javascript in html
    const match = html.match(/const\s+CHANNELS\s*=\s*(\[[\s\S]*?\])\s*;/);
    if (!match) {
      throw new Error("Could not find CHANNELS array in the main page HTML.");
    }
    return JSON.parse(match[1]);
  } catch (err: any) {
    console.error("fetchUgbyChannels error:", err.message);
    throw err;
  }
}

const streamCache = new Map<string, { data: DecryptedStream; expiresAt: number }>();

export async function fetchUgbyStream(key: string, playToken: string): Promise<DecryptedStream | null> {
  const cacheKey = `${key}_${playToken}`;
  const now = Date.now();
  const cached = streamCache.get(cacheKey);
  if (cached && cached.expiresAt > now) {
    return cached.data;
  }

  const PLAY_API_URL = "https://ugby.livekhelatv.com/v1/mks/channel";
  const params = new URLSearchParams();
  params.set("key", key);
  params.set("access", playToken);

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
      throw new Error(`Stream play API HTTP error: status ${res.status}`);
    }

    const json = await res.json();
    if (!json || !json.success) {
      throw new Error(`Stream play API returned success=false: ${json?.message || 'no response'}`);
    }

    const decrypted = await decodePayload(json.payload, playToken);
    if (!decrypted) {
      throw new Error("Decryption of stream payload failed");
    }

    const result: DecryptedStream = {
      url: decrypted.url,
      type: decrypted.type || "hls",
      drm: decrypted.drm || "none",
      key_id: decrypted.key_id || decrypted.clearkey?.kid || undefined,
      key_value: decrypted.key_value || decrypted.clearkey?.key || undefined
    };

    // Cache stream details for 5 minutes (300,000 ms)
    streamCache.set(cacheKey, {
      data: result,
      expiresAt: now + 5 * 60 * 1000
    });

    return result;
  } catch (err: any) {
    console.error(`fetchUgbyStream error for key ${key}:`, err.message);
    return null;
  }
}
