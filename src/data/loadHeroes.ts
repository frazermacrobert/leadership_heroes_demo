// Minimal shim so any legacy calls keep working.
import heroes from "./heroes.json";

export async function loadHeroes() {
  // If your source of truth is src/data/heroes.json:
  return heroes as any[];

  // If instead you keep it in public/data/heroes.json, use this version:
  // const res = await fetch(`${import.meta.env.BASE_URL}data/heroes.json`);
  // if (!res.ok) throw new Error(`HTTP ${res.status}`);
  // return res.json();
}
