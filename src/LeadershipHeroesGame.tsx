import React, { useEffect, useMemo, useRef, useState } from "react";
import heroesData from "./data/heroes.json";
import HeroCard from "./components/HeroCard";
import InfoModal from "./components/InfoModal";

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

function shuffle<T>(arr: T[]) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function LeadershipHeroesGame() {
  // Normalize once
  const deckAll = useMemo(() => {
    const src = Array.isArray(heroesData) ? (heroesData as any[]) : [];
    return src.map((c, i): Hero => ({
      id: c?.id ?? i + 1,
      number: Number(c?.number ?? i + 1),
      category: String(c?.category ?? "Uncategorised"),
      name: String(c?.name ?? c?.heroName ?? `Hero ${i + 1}`),
      tagline: c?.tagline ? String(c.tagline) : "",
      description: c?.description ? String(c.description) : "",
      color: String(c?.color ?? c?.primaryColor ?? "#6b7280"),
      secondary: String(c?.secondary ?? c?.secondaryColor ?? "#9ca3af"),
    }));
  }, []);

  // Game state
  const [drawPile, setDrawPile] = useState<Hero[]>([]);
  const [hand, setHand] = useState<Hero[]>([]);
  const [discard, setDiscard] = useState<Hero[]>([]);
  const [submitted, setSubmitted] = useState(false);

  // UI state
  const [showIntro, setShowIntro] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [showNoMorePopup, setShowNoMorePopup] = useState(false);
  const submitBtnRef = useRef<HTMLButtonElement>(null);

  // Derived
  const categories = useMemo(
    () => Array.from(new Set(deckAll.map((c) => c.category))).sort(),
    [deckAll]
  );

  useEffect(() => {
    // initial shuffle
    setDrawPile(shuffle(deckAll));
    setHand([]);
    setDiscard([]);
    setSubmitted(false);
    setShowIntro(true);
  }, [deckAll]);

  function dealFive() {
    if (submitted || hand.length > 0) return;
    const fresh = [...drawPile];
    const next = fresh.splice(0, 5);
    setDrawPile(fresh);
    setHand(next);
    setShowIntro(false);
  }

  function discardCard(idx: number) {
    if (submitted) return;
    const freshHand = [...hand];
    const removed = freshHand.splice(idx, 1)[0];

    if (drawPile.length === 0) {
      // No replacement available → just remove & notify
      setShowNoMorePopup(true);
    } else {
      freshHand.push(drawPile[0]); // replace with top of draw
    }

    setHand(freshHand);
    setDiscard((d) => [...d, removed]);
    setDrawPile((prev) => prev.slice(1));
  }

  function submitTeam() {
    if (hand.length !== 5) return;
    setSubmitted(true);
    // (Optional) Hook up to a leaderboard/store later
  }

  function resetGame() {
    setDrawPile(shuffle(deckAll));
    setHand([]);
    setDiscard([]);
    setSubmitted(false);
    setShowIntro(true);
    setShowNoMorePopup(false);
  }

  // Focus submit when out of cards & hand-size == 5
  useEffect(() => {
    if (drawPile.length === 0 && hand.length === 5 && !submitted) {
      setTimeout(() => submitBtnRef.current?.focus(), 50);
    }
  }, [drawPile.length, hand.length, submitted]);

  if (!deckAll.length) return <div className="p-6">No heroes found.</div>;

  return (
    <main className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Toasts/Popups can be added here */}

      {/* Intro banner */}
      {showIntro && (
        <div className="rounded-xl border bg-white p-4">
          <h2 className="font-semibold mb-1">Build your Leadership Heroes team</h2>
          <p className="text-sm text-gray-700">
            You’ll be dealt <b>5 cards</b>. Click a card to <b>discard</b> it and draw a
            replacement. When you’re happy with your five, click <b>Submit</b>.
          </p>
          <div className="mt-3 flex gap-2">
            <button className="px-3 py-2 rounded-lg border shadow-sm hover:shadow" onClick={dealFive}>
              🎴 Deal 5
            </button>
            <button className="px-3 py-2 rounded-lg border shadow-sm hover:shadow" onClick={() => setShowInfo(true)}>
              ℹ️ Info
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Leadership Heroes – Card Exercise</h1>
        <div className="flex gap-2">
          <button className="px-3 py-2 rounded-lg border shadow-sm hover:shadow" onClick={dealFive} disabled={hand.length > 0 || submitted}>
            🎴 Deal 5
          </button>
          <button className="px-3 py-2 rounded-lg border shadow-sm hover:shadow" onClick={() => setShowInfo(true)}>
            ℹ️ Info
          </button>
          <button className="px-3 py-2 rounded-lg border shadow-sm hover:shadow" onClick={resetGame}>
            🔁 Reset
          </button>
        </div>
      </header>

      {/* Player + counters */}
      <section className="rounded-xl border bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Draw pile: <b>{drawPile.length}</b> &nbsp;•&nbsp; In hand: <b>{hand.length}</b> &nbsp;•&nbsp; Discarded: <b>{discard.length}</b>
          </div>
          {hand.length === 5 && !submitted && (
            <button
              ref={submitBtnRef}
              className="px-3 py-2 rounded-lg border shadow-sm hover:shadow"
              onClick={submitTeam}
              title="Submit your five"
            >
              ✅ Submit 5 Cards
            </button>
          )}
        </div>
        <p className="mt-2 text-xs text-gray-500">Tip: Click a card to <b>discard</b> it. Discarded cards can’t be recovered.</p>
      </section>

      {/* Hand */}
      <section className="rounded-xl border bg-white p-4">
        <h2 className="font-semibold mb-3">Your Hand</h2>
        {hand.length === 0 ? (
          <div className="text-sm text-gray-500">Click “Deal 5” to start.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hand.map((h, idx) => (
              <HeroCard
                key={h.id}
                hero={h}
                onClick={() => discardCard(idx)}
                clickable={!submitted}
                drawEmpty={drawPile.length === 0}
              />
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
                  <span className="font-medium">#{d.number}</span> — {d.name} <span className="text-gray-500">({d.category})</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Info modal */}
      <InfoModal open={showInfo} onClose={() => setShowInfo(false)} categories={categories} />

      {/* No-more-cards popup (simple) */}
      {showNoMorePopup && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setShowNoMorePopup(false)} />
          <div className="fixed z-50 inset-0 grid place-items-center p-4">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border p-5">
              <h3 className="text-lg font-semibold mb-2">No more cards in the deck</h3>
              <p className="text-sm text-gray-700">
                The draw pile is empty. {hand.length === 5 ? "You’ve got five — submit your team." : "Finish with the cards you have."}
              </p>
              <div className="mt-4 flex justify-end">
                <button className="px-3 py-1.5 rounded border shadow-sm hover:shadow" onClick={() => setShowNoMorePopup(false)}>
                  Okay
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
