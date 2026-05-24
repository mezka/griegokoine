function isAvailable() {
  try {
    const key = "__storage_test__";
    window.localStorage.setItem(key, key);
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function save(key, data) {
  if (!isAvailable()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // Silencioso: la persistencia no debe bloquear la app
  }
}

export function load(key, defaultValue = null) {
  if (!isAvailable()) return defaultValue;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}
