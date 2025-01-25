import "./styles.scss";
import { parseHTML } from "./utils.js";

const AudioPoolSize = 3;

let GXModId = GM_getValue("GXMModId") || "";
let GXModData = null;

/** @type {{ name: string, audios: HTMLAudioElement[], audioIdx: number }[]} */
let KeyboardSoundsCache = [];

/** @type {HTMLAudioElement} */
let BackgroundMusicAudio = null;

let SpecialKeyNames = [
  "backspace",
  "tab",
  "enter",
  "space",
  "shift",
  "control",
  "alt",
  "capslock",
  "escape"
];

async function updateModData() {
  if (!GXModId) {
    GXModData = null;
    return;
  }
  const res = await fetch(`https://uncors.armagan.rest/https://api.gx.me/store/v3/mods/${GXModId}`).then(d => d.json());
  if (res.errors.length) {
    console.error(res.errors);
    GXModData = null;
    return;
  }
  GXModData = res.data;
  console.log("GXModData", GXModData);

  KeyboardSoundsCache.forEach(({ audios }) => {
    audios.forEach(audio => audio.remove());
  });

  KeyboardSoundsCache.length = 0;

  BackgroundMusicAudio?.remove();
  BackgroundMusicAudio = null;

  let volume = GM_getValue("GXMKeyboardSoundVolume") ?? 0.5;
  GXModData.contentFiles.filter(file => file.fileType === "KEYBOARD_SOUND").forEach(async (file) => {
    let audios = [];
    for (let i = 0; i < AudioPoolSize; i++) {
      const audio = document.createElement("audio");
      audio.preload = "auto";
      audio.src = file.variants.find(v => v.variantKey === "mp3")?.url || `${GXModData.contentUrl}/${file.archivePath}`;
      audio.load();
      audio.volume = volume;
      audios.push(audio);
    }
    KeyboardSoundsCache.push(
      {
        name: file.archivePath.split("/").pop().split(".")[0].toLowerCase(),
        audios,
        audioIdx: 0,
      }
    );
  });

  console.log("KeyboardSoundsCache", KeyboardSoundsCache);

  const backgroundMusics = GXModData.contentFiles.filter(file => file.fileType === "BACKGROUND_MUSIC");
  console.log("backgroundMusics", backgroundMusics);

  let backgroundMusicIdx = 0;
  if (backgroundMusics.length) {
    BackgroundMusicAudio = document.createElement("audio");
    BackgroundMusicAudio.preload = "auto";
    BackgroundMusicAudio.volume = GM_getValue("GXMBackgroundMusicVolume") ?? 0.0;
    BackgroundMusicAudio.load();

    let backgroundMusic = backgroundMusics[backgroundMusicIdx];
    BackgroundMusicAudio.src = backgroundMusic.variants.find(v => v.variantKey === "mp3")?.url || `${GXModData.contentUrl}/${backgroundMusic.archivePath}`;
    BackgroundMusicAudio.play().catch(() => { });
    BackgroundMusicAudio.onended = () => {
      backgroundMusicIdx = (backgroundMusicIdx + 1) % backgroundMusics.length;
      backgroundMusic = backgroundMusics[backgroundMusicIdx];
      BackgroundMusicAudio.src = backgroundMusic.variants.find(v => v.variantKey === "mp3")?.url || `${GXModData.contentUrl}/${backgroundMusic.archivePath}`;
      BackgroundMusicAudio.play().catch(() => { });
    }
  }
}

function patchGXMGui() {

  const gmxGuiElm = parseHTML(`
    <div id="gxm-gui" class="hidden">
      <div class="gxm--header">
        <div class="gxm--title">GXMods for All</div>
        <div class="gxm--close">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="currentColor" d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z"></path>
          </svg>
        </div>
      </div>
      <div class="gxm--content">
        <div class="gxm--section" data-default-state="true">
          <div class="gxm--header">
            <div class="gxm--title">
              General
            </div>
            <div class="gxm--line"></div>
            <div class="gxm--toggle">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fill="currentColor" d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z"></path>
              </svg>
            </div>
          </div>
          <div class="gxm--content">
            <input class="gxm--mod-id" placeholder="Mod ID"></input>
          </div>
        </div>
        <div class="gxm--section" data-default-state="false">
          <div class="gxm--header">
            <div class="gxm--title">
              Keyboard Sounds
            </div>
            <div class="gxm--line"></div>
            <div class="gxm--toggle">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fill="currentColor" d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z"></path>
              </svg>
            </div>
          </div>
          <div class="gxm--content">
            <input type="range" class="gxm--keyboard-sound-volume" min="0" max="100" step="0.1"></input>
          </div>
        </div>
        <div class="gxm--section" data-default-state="false">
          <div class="gxm--header">
            <div class="gxm--title">
              Background Music
            </div>
            <div class="gxm--line"></div>
            <div class="gxm--toggle">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fill="currentColor" d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z"></path>
              </svg>
            </div>
          </div>
          <div class="gxm--content">
            <input type="range" class="gxm--background-music-volume" min="0" max="100" step="0.1"></input>
          </div>
        </div>
      </div>
    </div>  
  `);

  let typeHistory = "";
  document.body.addEventListener("keyup", (e) => {
    typeHistory += e.key.toLowerCase();

    if (typeHistory.includes("gxm")) {
      gmxGuiElm.classList.toggle("hidden");
      typeHistory = "";
    }

    if (typeHistory.length >= 9)
      typeHistory = "";
  });

  document.body.addEventListener("keydown", (e) => {
    if (BackgroundMusicAudio && BackgroundMusicAudio.paused) {
      BackgroundMusicAudio.play().catch(() => { });
    }

    if (!KeyboardSoundsCache.length) return;
    let key = e.key.toLowerCase();
    let nonSpecials = KeyboardSoundsCache.filter(s => !SpecialKeyNames.some(k => s.name.includes(k)));
    if (key.length === 1) {
      sound = nonSpecials[Math.floor(Math.random() * nonSpecials.length)];
    } else {
      sound = KeyboardSoundsCache.find(s => s.name.includes(key));
      if (!sound) sound = nonSpecials[Math.floor(Math.random() * nonSpecials.length)];
    }
    if (!sound) return;
    let audio = sound.audios[sound.audioIdx = (sound.audioIdx + 1) % sound.audios.length];
    if (!audio) return;
    audio.currentTime = 0;
    audio.play();
  });

  gmxGuiElm.querySelector(".gxm--close").addEventListener("click", () => {
    gmxGuiElm.classList.add("hidden");
  });

  gmxGuiElm.querySelectorAll(".gxm--section").forEach((section) => {
    const toggleElm = section.querySelector(".gxm--toggle");
    const contentElm = section.querySelector(".gxm--content");
    let state = section.getAttribute("data-default-state") === "true";
    toggleElm.addEventListener("click", () => {
      state = !state;
      section.classList.toggle("collapsed", state);
      contentElm.classList.toggle("hidden", state);
      toggleElm.classList.toggle("collapsed", state);
    });
  });

  const modIdElm = gmxGuiElm.querySelector(".gxm--mod-id");
  modIdElm.value = GXModId;

  modIdElm.addEventListener("blur", () => {
    GM_setValue("GXMModId", modIdElm.value);
    if (modIdElm.value == GXModId) return;
    GXModId = modIdElm.value;
    updateModData();
  });

  const keyboardSoundVolumeElm = gmxGuiElm.querySelector(".gxm--keyboard-sound-volume");
  keyboardSoundVolumeElm.value = GM_getValue("GXMKeyboardSoundVolume") ?? 0.5;

  keyboardSoundVolumeElm.addEventListener("input", () => {
    let volume = parseFloat(keyboardSoundVolumeElm.value) / 100;
    GM_setValue("GXMKeyboardSoundVolume", volume);
    KeyboardSoundsCache.forEach(({ audios }) => {
      audios.forEach(audio => audio.volume = volume);
    });
  });

  const backgroundMusicVolumeElm = gmxGuiElm.querySelector(".gxm--background-music-volume");
  backgroundMusicVolumeElm.value = GM_getValue("GXMBackgroundMusicVolume") ?? 0.0;

  backgroundMusicVolumeElm.addEventListener("input", () => {
    let volume = parseFloat(backgroundMusicVolumeElm.value) / 100;
    GM_setValue("GXMBackgroundMusicVolume", volume);
    if (BackgroundMusicAudio) {
      BackgroundMusicAudio.volume = volume;
    }
  });

  document.body.appendChild(gmxGuiElm);
  updateModData();
}

setTimeout(patchGXMGui, 1000);