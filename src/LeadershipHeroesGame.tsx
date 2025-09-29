import React, { useMemo, useState } from "react";
import heroesData from "./data/heroes.json";
import HeroCard from "./components/HeroCard";

// ---------- Types ----------
type Hero = {
  id: string | number;
  number: number;
  category: string;
  name: string;
  tagline?: string;
  description?: string;
  color: string;
  secondary: string;
};

// ---------- Utils ----------
function shuffle<T>(arr: T[]) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

import { resolveColors } from "./utils/colors";

const normalize = (list: any[]): Hero[] =>
  list.map((c: any, i: number): Hero => {
    const { primary, secondary } = resolveColors(String(c?.category ?? "Uncategorised"), c?.color, c?.secondary);
    return {
      id: c?.id ?? i + 1,
      number: Number(c?.number ?? i + 1),
      category: String(c?.category ?? "Uncategorised"),
      name: String(c?.name ?? c?.heroName ?? `Hero ${i + 1}`),
      tagline: c?.tagline ? String(c.tagline) : "",
      description: c?.description ? String(c.description) : "",
      color: primary,
      secondary,
    };
  });


// ---------- Component ----------
export default function LeadershipHeroesGame() {
  // Full deck (stable for the session)
  const fullDeck = useMemo(
    () => normalize(Array.isArray(heroesData) ? (heroesData as any[]) : []),
    []
  );

  // Game state
  const [hand, setHand] = useState<Hero[]>([]);         // selected up to 5
  const [discard, setDiscard] = useState<Hero[]>([]);   // non-retrievable list
  const [drawPile, setDrawPile] = useState<Hero[]>(() => shuffle(fullDeck)); // remaining pool you can browse
  const [submitted, setSubmitted] = useState(false);

  // UI state
  const [info, setInfo] = useState<string | null>(null);

  // Derived
  const remainingThree = drawPile.slice(0, 3);
  const remainingCount = drawPile.length;

  // Helpers
  const isInHand = (h: Hero) => hand.some(x => x.id === h.id);
  const isInDiscard = (h: Hero) => discard.some(x => x.id === h.id);

  function addFromRemaining(index: number) {
    const card = remainingThree[index];
    if (!card) return;

    if (hand.length >= 5) {
      setInfo("Please discard a card from your hand before adding a new card.");
      return;
    }
    // add to hand; remove from drawPile
    setHand(prev => [...prev, card]);
    setDrawPile(prev => prev.filter(h => h.id !== card.id));
    setInfo(null);
  }

  function discardFromRemaining(index: number) {
    const card = remainingThree[index];
    if (!card) return;

    setDiscard(prev => [...prev, card]);
    setDrawPile(prev => prev.filter(h => h.id !== card.id));
    setInfo(null);
  }

  function discardFromHand(index: number) {
    const card = hand[index];
    if (!card) return;
    setHand(prev => prev.filter((_, i) => i !== index));
    setDiscard(prev => [...prev, card]);
    setInfo(null);
  }

  function reshuffleExcludingHand() {
    // Build a new pile from everything EXCEPT what's in hand
    const excludeIds = new Set(hand.map(h => h.id));
    const pool = fullDeck.filter(h => !excludeIds.has(h.id));
    // (Duplicates prevention: also exclude already in discard if you prefer;
    // your brief wants previously discarded to reappear on reshuffle, so we keep them.)
    setDrawPile(shuffle(pool));
    setInfo(null);
  }

  function submitHeroes() {
    if (hand.length !== 5) {
      setInfo("You need exactly 5 heroes to submit.");
      return;
    }
    setSubmitted(true);
    setInfo(null);
  }

  function downloadSelectedJSON() {
    const data = JSON.stringify(hand, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "selected_heroes.json";
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
  }

  // Guards
  if (!fullDeck.length) return <div className="p-6">No heroes found.</div>;

  return (
    <main className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Leadership Heroes – Card Exercise</h1>
        <div className="flex gap-2">
          <button
            onClick={() => {
              // hard reset
              setHand([]);
              setDiscard([]);
              setDrawPile(shuffle(fullDeck));
              setSubmitted(false);
              setInfo(null);
            }}
            className="px-3 py-2 rounded-lg border shadow-sm hover:shadow transition"
          >
            🔁 Reset
          </button>
        </div>
      </header>

      {/* Explainer */}
      <section className="rounded-xl border bg-white p-4">
        <h2 className="font-semibold mb-2">How it works</h2>
        <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
          <li><strong>Remaining cards</strong> shows the next three cards from the deck.</li>
          <li>Use <strong>✅</strong> to add a card to <strong>Your hand</strong> (max 5). Use <strong>❌</strong> to permanently discard it.</li>
          <li>If your hand is full, discard a hand card first to make space.</li>
          <li>When there are no cards left to view, discard any on screen, then click <strong>Reshuffle</strong> to see the rest (excluding cards in your hand).</li>
          <li>When happy, click <strong>Submit heroes</strong>.</li>
        </ol>
        {info && <p className="mt-2 text-sm text-amber-700">{info}</p>}
      </section>

      {/* Remaining cards */}
      <section className="rounded-xl border bg-white p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Remaining cards</h2>
          <div className="text-sm text-gray-700">
            Remaining to view: <b>{remainingCount}</b>
          </div>
        </div>

        {remainingThree.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-4">
            {remainingThree.map((h, idx) => (
              <div key={h.id} className="space-y-2">
                <HeroCard hero={h} />
                <div className="flex gap-2">
       <button
  onClick={() => addFromRemaining(idx)}
  disabled={hand.length >= 5}
  className={[
    "flex-1 px-3 py-2 rounded-lg border shadow-sm transition flex items-center justify-center gap-1",
    hand.length >= 5
      ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
      : "hover:shadow"
  ].join(" ")}
  title={
    hand.length >= 5
      ? "Hand full – discard from your hand first."
      : "Add to your hand"
  }
>
  {hand.length >= 5 ? (
    <>
      🔒 <span>Add to hand</span>
    </>
  ) : (
    <>
      ✅ <span>Add to hand</span>
    </>
  )}
</button>


                  <button
                    className="flex-1 px-3 py-2 rounded-lg border shadow-sm hover:shadow transition"
                    onClick={() => discardFromRemaining(idx)}
                    title="Discard this card"
                  >
                    ❌ Discard
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500">No cards currently visible.</div>
        )}

        {/* Reshuffle when completely out (no draw + none showing) */}
        {drawPile.length === 0 && remainingThree.length === 0 && !submitted && (
          <div className="pt-1">
            <button
              className="px-3 py-2 rounded-lg border shadow-sm hover:shadow transition"
              onClick={reshuffleExcludingHand}
              title="Reshuffle the remaining cards (excluding your hand)"
            >
              🔀 Reshuffle remaining deck
            </button>
          </div>
        )}
      </section>

      {/* Hand */}
      <section
        className={[
          "rounded-xl border p-4",
          submitted ? "bg-amber-50" : "bg-white",
        ].join(" ")}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Your hand ({hand.length}/5)</h2>
          {!submitted ? (
            <button
              onClick={submitHeroes}
              disabled={hand.length !== 5}
              className={[
                "px-3 py-2 rounded-lg border shadow-sm hover:shadow transition",
                hand.length !== 5 ? "opacity-50 cursor-not-allowed" : "",
              ].join(" ")}
            >
              ✅ Submit heroes
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                className="px-3 py-2 rounded-lg border shadow-sm hover:shadow transition"
                onClick={downloadSelectedJSON}
                title="Download your selected heroes as JSON"
              >
                ⬇️ Download JSON
              </button>
            </div>
          )}
        </div>

        {hand.length === 0 ? (
          <div className="text-sm text-gray-500">Add heroes from “Remaining cards”.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hand.map((h, idx) => (
              <div key={h.id} className="space-y-2">
                <HeroCard hero={h} />
                {!submitted && (
                  <div className="flex gap-2">
                    <button
                      className="flex-1 px-3 py-2 rounded-lg border shadow-sm hover:shadow transition"
                      onClick={() => discardFromHand(idx)}
                      title="Remove this card from your hand"
                    >
                      ❌ Discard from hand
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Discard list */}
      <section className="rounded-xl border bg-white p-4">
        <h2 className="font-semibold mb-2">Discard pile ({discard.length})</h2>
        {discard.length === 0 ? (
          <div className="text-sm text-gray-500">Nothing discarded yet.</div>
        ) : (
          <div className="max-h-64 overflow-auto text-sm">
            <ul className="space-y-1">
              {discard.map((d) => (
                <li key={`disc-${d.id}`} className="text-gray-700">
                  <span className="font-medium">#{d.number}</span> — {d.name}{" "}
                  <span className="text-gray-500">({d.category})</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Reflections (post-submit) */}
      {submitted && (
        <section className="rounded-xl border bg-white p-4">
          <h2 className="font-semibold mb-2">Reflections</h2>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            <li>What made you value these skills above others?</li>
            <li>Can you think of a real world or fictional character that possesses the skills you chose?</li>
            <li>How might a leader develop their skills to become like your five heroes?</li>
          </ul>
        </section>
      )}
    </main>
  );
}
