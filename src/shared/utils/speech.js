import { transliterate } from "./transliterate.js";

let voices = [];
let voicesLoaded = false;

function initVoices() {
  if (typeof window === "undefined") return;
  if (voicesLoaded) return;
  voicesLoaded = true;

  voices = window.speechSynthesis.getVoices();
  if (!voices.length) {
    window.speechSynthesis.addEventListener("voiceschanged", () => {
      voices = window.speechSynthesis.getVoices();
    }, { once: true });
  }
}

export function isSpeechSupported() {
  return typeof window !== "undefined"
    && !!window.speechSynthesis
    && !!window.SpeechSynthesisUtterance;
}

function pickVoice(lang) {
  if (!voices.length) return null;
  const code = lang.toLowerCase();
  const match = voices.find(v => v.lang.toLowerCase().startsWith(code));
  return match || voices[0];
}

const GREEK_RE = /[\u0370-\u03ff\u1f00-\u1fff]/;

export function speak(text, { lang = "el", rate, pitch = 1 } = {}) {
  if (!isSpeechSupported()) return;
  initVoices();
  window.speechSynthesis.cancel();

  let finalText = text;
  let voice = pickVoice(lang);
  const finalRate = rate ?? (lang === "el" ? 0.75 : 0.85);

  if (lang === "el" && !voice && GREEK_RE.test(text)) {
    finalText = transliterate(text);
    voice = voices[0] || null;
  }

  const utterance = new SpeechSynthesisUtterance(finalText);
  utterance.lang = lang;
  utterance.rate = finalRate;
  utterance.pitch = pitch;
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
}
