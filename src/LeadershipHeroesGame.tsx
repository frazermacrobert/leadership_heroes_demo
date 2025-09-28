// src/LeadershipHeroesGame.tsx
import { useEffect, useState } from "react";
import HeroCard from "./components/HeroCard";
import heroesData from "./data/heroes.json";

// Base data shape from JSON
export type Hero = {
  id: string;
  number: number;
  category: string;
  name: string;
  tagline: string;
  description: string;
  color: string;
  secondary: string;
};

// If later code expects extra fields, extend here
type EnrichedHero = Hero & { image?: string };

function LeadershipHeroesGame() {
  // 1) Load heroes (no fetch)
  const [heroes, setHeroes] = useState<EnrichedHero[] | null>(null);

  useEffect(() => {
    setHeroes(heroesData as EnrichedHero[]);
  }, []);

  // 2) Game state (use EnrichedHero to match everywhere)
  const [initialised, setInitialised] = useState(false);
  const [deck, setDeck] = useState<EnrichedHero[]>([]);
  const [discard, setDiscard] = useState<EnrichedHero[]>([]);
  const [team, setTeam] = useState<(EnrichedHero | null)[]>([null, null, null, null, null]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (heroes === null) return <div className="p-6">Loading heroes…</div>;
  if (heroes.length === 0) return <div className="p-6">No heroes found.</div>;

  // 3) Render (use imported HeroCard)
  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Leadership Heroes</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {heroes.map((h) => (
          <HeroCard key={h.id} hero={h} clickable />
        ))}
      </div>

      {/* Example: grey discard pile */}
      {discard.length > 0 && (
        <aside className="mt-6 p-4 rounded-xl border bg-gray-50 text-gray-600">
          <h2 className="font-semibold mb-2">Discarded heroes</h2>
          <ul className="space-y-1 text-sm">
            {discard.map((h) => (
              <li key={h.id}>#{h.id} — {h.name}</li>
            ))}
          </ul>
        </aside>
      )}
    </main>
  );
}

// 👇 Exactly ONE default export
export default LeadershipHeroesGame;
