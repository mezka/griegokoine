import { Volume2 } from "lucide-react";
import { speak, isSpeechSupported } from "../utils/speech.js";

export default function AudioButton({ text, lang = "es", label, size = 14, className = "" }) {
  if (!isSpeechSupported()) {
    return (
      <button
        disabled
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 text-stone-400 text-[9px] tracking-[0.14em] uppercase font-medium bg-transparent cursor-not-allowed ${className}`}
        title="audio no disponible en este navegador"
      >
        <Volume2 size={size} /> {label}
      </button>
    );
  }

  if (label) {
    return (
      <button
        onClick={(e) => { e.stopPropagation(); speak(text, { lang }); }}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line-mid text-accent text-[9px] tracking-[0.14em] uppercase font-medium bg-transparent cursor-pointer ${className}`}
        title={`${label}: ${text}`}
      >
        <Volume2 size={size} /> {label}
      </button>
    );
  }

  return (
    <button
      onClick={(e) => { e.stopPropagation(); speak(text, { lang }); }}
      className={`inline-flex items-center justify-center p-2 border-2 border-stone-800 bg-[#fbf5e6] hover:bg-stone-800 hover:text-stone-50 transition cursor-pointer ${className}`}
      title={`escuchar: ${text}`}
    >
      <Volume2 size={size} />
    </button>
  );
}
