import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Z } from "../styles/theme.js";

export default function BackHomeLink() {
  return (
    <Link
      to="/"
      className="inline-flex items-center gap-1.5 font-sans text-[11px] font-medium tracking-[0.08em] text-ink no-underline py-2 px-3.5 rounded-full cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-line"
      style={{
        position: "fixed",
        top: "0.875rem",
        left: "0.875rem",
        zIndex: Z.backHome,
        background: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <ArrowLeft size={14} strokeWidth={1.8} /> volver
    </Link>
  );
}
