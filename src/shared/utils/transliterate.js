export function transliterate(greek) {
  const decomp = greek.normalize("NFD");
  let prefix = "";
  const firstCharMatch = decomp.match(/^([\u0370-\u03ff\u1f00-\u1fff])([\u0300-\u036f]*)/);
  if (firstCharMatch) {
    const marks = firstCharMatch[2];
    if (marks.includes("\u0314")) prefix = "h";
  }

  let s = decomp.replace(/[\u0300-\u036f]/g, "").toLowerCase();
  s = s.replace(/ου/g, "u");
  s = s.replace(/αυ/g, "au");
  s = s.replace(/ευ/g, "eu");
  s = s.replace(/ηυ/g, "eu");
  s = s.replace(/αι/g, "ai");
  s = s.replace(/ει/g, "ei");
  s = s.replace(/οι/g, "oi");
  s = s.replace(/υι/g, "ui");
  s = s.replace(/γγ/g, "ng");
  s = s.replace(/γκ/g, "nk");
  s = s.replace(/γξ/g, "nks");
  s = s.replace(/γχ/g, "nj");

  const map = {
    α: "a", β: "b", γ: "g", δ: "d", ε: "e",
    ζ: "ds", η: "e", θ: "z", ι: "i", κ: "k",
    λ: "l", μ: "m", ν: "n", ξ: "ks", ο: "o",
    π: "p", ρ: "r", σ: "s", ς: "s", τ: "t",
    υ: "i", φ: "f", χ: "j", ψ: "ps", ω: "o",
  };

  let out = "";
  for (const ch of s) out += (map[ch] !== undefined ? map[ch] : ch);
  return prefix + out;
}
