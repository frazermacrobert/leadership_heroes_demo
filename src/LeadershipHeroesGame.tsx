// src/LeadershipHeroesGame.tsx
import { useEffect, useMemo, useState } from "react";
import HeroCard from "./components/HeroCard";
import heroesData from "./data/heroes.json";

// Types that match HeroCard
type Hero = {
  id: string | number;
  number: number;
  category: string;
  name: string;
  tagline: string;
  description: string;
  color: string;
  secondary: string;
  image?: string;
};
type EnrichedHero = Hero;

// Utilities
function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function LeadershipHeroesGame() {
  const baseHeroes = useMemo(() => (heroesData as Hero[]).filter(Boolean), []);
  const [deck, setDeck] = useState<EnrichedHero[]>([]);
  const [hand, setHand] = useState<EnrichedHero[]>([]);
  const [team, setTeam] = useState<EnrichedHero[]>([]);
  const [discard, setDiscard] = useState<EnrichedHero[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  // init deck
  useEffect(() => {
    const d = shuffle(baseHeroes);
    setDeck(d);
    setHand(d.slice(0, 3));
    setMessage("Pick one card from the hand. Build a team of five.");
  }, [baseHeroes]);

  function drawNextHand(fromDeck: EnrichedHero[], used: number) {
    return fromDeck.slice(used, used + 3);
  }

  // choose one from the hand → move others to discard, draw next
  function chooseFromHand(idx: number) {
    const chosen = hand[idx];
    const others = hand.filter((_, i) => i !== idx);
    const used = team.length * 3 + 3; // how many cards we've consumed from deck as hands
    const nextHand = drawNextHand(deck, used);

    setTeam((t) => [...t, chosen]);
    setDiscard((d) => [...d, ...others]);
    setHand(nextHand);

    if (team.length + 1 >= 5) {
      setMessage("Team complete! You picked 5 heroes.");
    } else if (nextHand.length === 0) {
      setMessage("No more cards to draw. Pick from what you have.");
    } else {
      setMessage(`Great. ${5 - (team.length + 1)} to go.`);
    }
  }

  function resetGame() {
    const d = shuffle(baseHeroes);
    setDeck(d);
    setHand(d.slice(0, 3));
    setTeam([]);
    setDiscard([]);
    setMessage("Pick one card from the hand. Build a team of five.");
  }

  if (!baseHeroes.length) return <div className="p-6">No heroes found.</div>;

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Leadership Heroes</h1>
        <button
          onClick={resetGame}
          className="px-3 py-2 rounded-lg border shadow-sm hover:shadow transition"
        >
          Reset
        </button>
      </header>

      {message && <p className="mb-4 text-sm text-gray-600">{message}</p>}

      {/* Team (chosen 5) */}
      <section className="mb-8">
        <h2 className="font-semibold mb-2">Your team ({team.length}/5)</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 5 }).map((_, i) =>
            team[i] ? (
              <HeroCard key={team[i].id} hero={team[i]} />
            ) : (
              <div
                key={`empty-${i}`}
                className="rounded-2xl border border-dashed h-28 grid place-items-center text-sm text-gray-500"
              >
                Empty slot
              </div>
            )
          )}
        </div>
      </section>

      {/* Hand (pick 1) */}
      <section className="mb-8">
        <h2 className="font-semibold mb-2">Hand — pick one</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {hand.map((h, idx) => (
            <HeroCard
              key={h.id}
              hero={h}
              clickable
              onClick={() => chooseFromHand(idx)}
            />
          ))}
          {hand.length === 0 && (
            <div className="text-sm text-gray-500">
              No cards in hand. Reset to play again.
            </div>
          )}
        </div>
      </section>

      {/* Discard (compact) */}
      <section className="mb-4">
        <h2 className="font-semibold mb-2">Discard pile ({discard.length})</h2>
        <div className="text-xs text-gray-500">
          {discard.slice(0, 12).map((d) => d.name).join(" • ")}
          {discard.length > 12 ? " • …" : ""}
        </div>
      </section>
    </main>
  );
}
