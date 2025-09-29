import { useEffect, useMemo, useState } from "react";
import HeroCard from "./components/HeroCard";
import heroesData from "./data/heroes.json";

// ---------- Types ----------
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

// ---------- Utilities ----------
const safeStr = (v: unknown) => (typeof v === "string" ? v : "");
const DEFAULT_PRIMARY = "#6b7280";   // gray-600
const DEFAULT_SECONDARY = "#9ca3af"; // gray-400

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Normalize raw JSON -> safe heroes
function normalize(list: any[]): EnrichedHero[] {
  return list.map((h, i) => ({
    id: String(h?.id ?? i + 1),
    number: Number(h?.number ?? i + 1),
    category: safeStr(h?.category) || "Uncategorised",
    name: safeStr(h?.name) || `Hero ${i + 1}`,
    tagline: safeStr(h?.tagline),
    description: safeStr(h?.description),
    color: safeStr(h?.color) || DEFAULT_PRIMARY,
    secondary: safeStr(h?.secondary) || DEFAULT_SECONDARY,
    image: safeStr(h?.image) || undefined,
  }));
}

// ---------- Component ----------
export default function LeadershipHeroesGame() {
  const baseHeroes = useMemo(
    () => normalize(Array.isArray(heroesData) ? (heroesData as any[]) : []),
    []
  );

  // deckPos = next index to draw from the deck
  const [deck, setDeck] = useState<EnrichedHero[]>([]);
  const [deckPos, setDeckPos] = useState(0);

  const [hand, setHand] = useState<EnrichedHero[]>([]);
  const [team, setTeam] = useState<EnrichedHero[]>([]);
  const [discard, setDiscard] = useState<EnrichedHero[]>([]);
  const [showAllDiscard, setShowAllDiscard] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Init / Reset
  useEffect(() => {
    resetGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function resetGame() {
    const d = shuffle(baseHeroes);
    setDeck(d);
    setDeckPos(0);
    const first3 = d.slice(0, 3);
    setHand(first3);
    setTeam([]);
    setDiscard([]);
    setMessage("Pick ONE from the hand. Build a team of FIVE.");
    setShowAllDiscard(false);
  }

  // Draw helpers
  function drawOne(from: EnrichedHero[], pos: number): { next?: EnrichedHero; pos: number } {
    if (pos >= from.length) return { pos };
    return { next: from[pos], pos: pos + 1 };
  }

  function refillHand(current: EnrichedHero[], futureTeamCount: number) {
    // Keep refilling up to 3 in hand, unless the team is complete
    if (futureTeamCount >= 5) return { nextHand: current, nextPos: deckPos };
    let newHand = current.slice();
    let pos = deckPos;
    while (newHand.length < 3 && pos < deck.length) {
      const { next, pos: p } = drawOne(deck, pos);
      pos = p;
      if (next) newHand.push(next);
    }
    return { nextHand: newHand, nextPos: pos };
  }

  // Actions
  function keepAt(index: number) {
    if (index < 0 || index >= hand.length) return;
    if (team.length >= 5) return;

    const chosen = hand[index];
    const remaining = hand.filter((_, i) => i !== index);

    const futureTeam = [...team, chosen];
    const { nextHand, nextPos } = refillHand(remaining, futureTeam.length);

    setTeam(futureTeam);
    setDiscard((d) => d); // unchanged
    setHand(nextHand);
    setDeckPos(nextPos);

    if (futureTeam.length >= 5) {
      setMessage("Team complete! You picked 5 heroes.");
    } else if (nextHand.length === 0 && nextPos >= deck.length) {
      setMessage("No more cards. Pick from what you have.");
    } else {
      setMessage(`Great — ${5 - futureTeam.length} to go.`);
    }
  }

  function discardAt(index: number) {
    if (index < 0 || index >= hand.length) return;

    const tossed = hand[index];
    const remaining = hand.filter((_, i) => i !== index);

    // refilling doesn't depend on discard count
    const { nextHand, nextPos } = refillHand(remaining, team.length);

    setDiscard((d) => [...d, tossed]);
    setHand(nextHand);
    setDeckPos(nextPos);

    if (team.length >= 5) {
      setMessage("Team complete! You picked 5 heroes.");
    } else if (nextHand.length === 0 && nextPos >= deck.length) {
      setMessage("No more cards to draw.");
    } else {
      setMessage("Discarded. Keep going.");
    }
  }

  const teamFull = team.length >= 5;

  if (!baseHeroes.length) return <div className="p-6">No heroes found.</div>;

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <header className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Leadership Heroes</h1>
        <button
          onClick={resetGame}
          className="px-3 py-2 rounded-lg border shadow-sm hover:shadow transition"
        >
          Reset
        </button>
      </header>

      {/* Instructions */}
      <section className="mb-4 rounded-xl border p-4 bg-white">
        <h2 className="font-semibold mb-2">How it works</h2>
        <ol className="list-decimal list-inside text-sm space-y-1 text-gray-700">
          <li>You are dealt a hand of <strong>3</strong> cards.</li>
          <li>For each hand, <strong>keep ONE</strong> hero for your team and <strong>discard</strong> the others (use the buttons below each card).</li>
          <li>Your goal is to build a team of <strong>FIVE</strong> heroes.</li>
          <li>Discarded cards go to the <em>discard pile</em> below. You can expand it to see them all.</li>
        </ol>
        {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
      </section>

      {/* Team */}
      <section className="mb-8">
        <h2 className="font-semibold mb-2">Your team ({team.length}/5)</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 5 }).map((_, i) =>
            team[i] ? (
              <HeroCard key={team[i].id} hero={team[i]} />
            ) : (
              <div
                key={`empty-${i}`}
                className="rounded-2xl border border-dashed h-28 grid place-items-center text-sm text-gray-500 bg-white"
              >
                Empty slot
              </div>
            )
          )}
        </div>
      </section>

      {/* Hand */}
      <section className="mb-8">
        <h2 className="font-semibold mb-2">
          Hand — {teamFull ? "team complete" : "pick one"}
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {hand.map((h, idx) => (
            <div key={h.id} className="space-y-2">
              <HeroCard hero={h} />
              <div className="flex gap-2">
                <button
                  disabled={teamFull}
                  onClick={() => keepAt(idx)}
                  className={[
                    "flex-1 px-3 py-2 rounded-lg border shadow-sm hover:shadow transition",
                    teamFull ? "opacity-50 cursor-not-allowed" : "",
                  ].join(" ")}
                >
                  Keep
                </button>
                <button
                  onClick={() => discardAt(idx)}
                  className="flex-1 px-3 py-2 rounded-lg border shadow-sm hover:shadow transition"
                >
                  Discard
                </button>
              </div>
            </div>
          ))}
          {hand.length === 0 && (
            <div className="text-sm text-gray-500">
              No cards in hand. {teamFull ? "You’re done!" : "Reset to play again."}
            </div>
          )}
        </div>
      </section>

      {/* Discard */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold">Discard pile ({discard.length})</h2>
          <button
            onClick={() => setShowAllDiscard((s) => !s)}
            className="text-sm underline"
          >
            {showAllDiscard ? "Collapse" : "Show all"}
          </button>
        </div>

        {showAllDiscard ? (
          <div className="rounded-xl border bg-white p-3 max-h-64 overflow-auto text-sm">
            <ul className="space-y-1">
              {discard.map((d) => (
                <li key={`disc-${d.id}`} className="text-gray-700">
                  <span className="font-medium">#{d.number}</span> — {d.name}{" "}
                  <span className="text-gray-500">({d.category})</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-xs text-gray-500">
            {discard.slice(0, 12).map((d) => d.name).join(" • ")}
            {discard.length > 12 ? " • …" : ""}
          </div>
        )}
      </section>
    </main>
  );
}
