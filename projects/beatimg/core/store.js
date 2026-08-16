/* Ayarların kalıcı saklanması — GM_setValue, yoksa localStorage */

import { DEFAULTS } from "./config.js";

const KEY = "beatimg:settings:v2";

function readRaw() {
  try {
    if (typeof GM_getValue === "function") {
      const v = GM_getValue(KEY, null);
      if (v != null) return v;
    }
  } catch { }
  try {
    return localStorage.getItem(KEY);
  } catch { }
  return null;
}

function writeRaw(str) {
  try {
    if (typeof GM_setValue === "function") {
      GM_setValue(KEY, str);
      return;
    }
  } catch { }
  try {
    localStorage.setItem(KEY, str);
  } catch { }
}

function load() {
  const raw = readRaw();
  if (!raw) return { ...DEFAULTS };
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    const out = { ...DEFAULTS };
    // Sadece bilinen anahtarları ve doğru tipteki değerleri al
    for (const k of Object.keys(DEFAULTS)) {
      if (parsed && typeof parsed[k] === typeof DEFAULTS[k]) out[k] = parsed[k];
    }
    return out;
  } catch {
    return { ...DEFAULTS };
  }
}

export const settings = load();

let saveTimer = null;

/** Ayarları günceller ve (throttle'lı) diske yazar */
export function setSetting(key, value) {
  if (!(key in DEFAULTS)) return;
  settings[key] = value;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => writeRaw(JSON.stringify(settings)), 250);
}

export function resetSettings() {
  Object.assign(settings, DEFAULTS);
  writeRaw(JSON.stringify(settings));
}
