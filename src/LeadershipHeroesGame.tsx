import React, { useEffect, useState } from "react";
import { loadHeroes, type EnrichedHero } from "./data/loadHeroes";
import HeroCard from "./components/HeroCard";

function LeadershipHeroesGame() {
  const [heroes, setHeroes] = useState<EnrichedHero[] | null>(null);
  // game state (use EnrichedHero to match the loader)
const [initialised, setInitialised] = useState(false);
const [deck, setDeck] = useState<EnrichedHero[]>([]);
const [discard, setDiscard] = useState<EnrichedHero[]>([]);
const [team, setTeam] = useState<(EnrichedHero | null)[]>([null, null, null, null, null]);
const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
const [submitted, setSubmitted] = useState(false);
const [message, setMessage] = useState<string | null>(null);


  useEffect(() => {
    loadHeroes().then(setHeroes).catch(() => setHeroes([]));
  }, []);

  if (heroes === null) return <div className="p-6">Loading heroes…</div>;
  if (heroes.length === 0) return <div className="p-6">No heroes found.</div>;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {heroes.map((h) => (
        <HeroCard key={h.id} hero={h} clickable />
      ))}
    </div>
  );
}

// 👇 only ONE default export at the end of the file
export default LeadershipHeroesGame;

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

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function downloadJSON(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

  React.useEffect(() => {
    if (!initialised) {
      setDeck(shuffle(HEROES as Hero[]));
      setInitialised(true);
    }
  }, [initialised]);

  const remainingTop = deck[deck.length - 1] || null;
  const allFiveChosen = team.every(Boolean);

  function placeTopIntoSlot(slotIndex: number) {
    if (!deck.length || team[slotIndex]) return;
    const top = deck[deck.length - 1];
    setTeam((t) => { const next = [...t]; next[slotIndex] = top; return next; });
    setDeck((d) => d.slice(0, -1));
  }

  function autoPlaceTop() {
    const emptyIndex = team.findIndex((s) => !s);
    if (emptyIndex === -1) {
      setMessage("Your team is full, please click on the hero card you wish to swap for the new card");
      setTimeout(() => setMessage(null), 4000);
      return;
    }
    placeTopIntoSlot(emptyIndex);
  }

  function onSlotClick(slotIndex: number) {
    if (!team[slotIndex]) return;
    setSelectedSlot(slotIndex === selectedSlot ? null : slotIndex);
  }

  function swapSlot() {
    if (selectedSlot === null || !deck.length) return;
    setTeam((t) => {
      const next = [...t];
      const outgoing = next[selectedSlot]!;
      const top = deck[deck.length - 1];
      setDiscard((d) => [outgoing, ...d]);
      next[selectedSlot] = top;
      return next;
    });
    setDeck((d) => d.slice(0, -1));
    setSelectedSlot(null);
  }

  function discardTop() {
    if (!deck.length) return;
    const top = deck[deck.length - 1];
    setDeck((d) => d.slice(0, -1));
    setDiscard((d) => [top, ...d]);
  }

  function resetAll() {
    setDeck(shuffle(HEROES as Hero[]));
    setDiscard([]);
    setTeam([null, null, null, null, null]);
    setSelectedSlot(null);
    setSubmitted(false);
  }

  function submitTeam() {
    if (!allFiveChosen) return;
    setSubmitted(true);
    downloadJSON("team-of-5-heroes.json", team.filter(Boolean));
  }

  const instructions = useMemo(
    () => (
      <div className="space-y-2 text-sm leading-relaxed">
        <p>
          Build your team of <span className="font-semibold">five super‑leaders</span>. Browse, place, and swap.
        </p>
        <ol className="list-decimal ml-5 space-y-1">
          <li>
            Click <span className="font-semibold">＋</span> on a slot to place the top card.
          </li>
          <li>
            Click a filled slot to <span className="font-semibold">Swap</span> or <span className="font-semibold">Keep</span>.
          </li>
          <li>Use ✕ on the remaining card to discard and see the next.</li>
          <li>Submit once all five slots are filled to download your team JSON.</li>
        </ol>
      </div>
    ),
    []
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-rose-50 via-amber-50 to-stone-100 text-neutral-900 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-rose-700">Leadership Heroes — Team Builder</h1>
            <p className="text-neutral-700 mt-1">Leadership development prototype.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setDeck((prev) => shuffle(prev))} className="px-3 py-2 rounded-xl border bg-rose-100 hover:bg-rose-200 shadow">
              Shuffle
            </button>
            <button onClick={resetAll} className="px-3 py-2 rounded-xl border bg-rose-100 hover:bg-rose-200 shadow">
              Reset
            </button>
          </div>
        </header>

        <section className="p-4 rounded-2xl bg-white/70 border shadow">{instructions}</section>

        {message && <div className="p-3 rounded-lg bg-rose-100 text-rose-700">{message}</div>}

        <section className="grid md:grid-cols-2 gap-6">
          <div className="p-4 rounded-2xl bg-white border shadow relative">
            <h2 className="font-semibold mb-3 flex items-center justify-between">
              <span>Remaining Hero</span>
              <span className="text-xs px-2 py-1 rounded-full bg-neutral-100 border">{deck.length}</span>
            </h2>
            <div className="h-64 rounded-xl border flex items-center justify-center relative">
              {remainingTop ? (
                <div className="relative w-full h-full p-3">
                  <HeroCard hero={remainingTop} />
                  <button
                    onClick={discardTop}
                    className="absolute bottom-2 right-2 bg-rose-600 text-white rounded-full w-9 h-9 flex items-center justify-center shadow hover:bg-rose-700"
                  >
                    ✕
                  </button>
                  <button
                    onClick={autoPlaceTop}
                    className="absolute top-2 right-2 bg-green-600 text-white rounded-full w-9 h-9 flex items-center justify-center shadow hover:bg-green-700"
                  >
                    ＋
                  </button>
                </div>
              ) : (
                <span className="text-neutral-500">No more cards</span>
              )}
            </div>
          </div>

          {/* Discard list: greyed, scrollable fixed-height list */}
          <div className="p-4 rounded-2xl bg-stone-100 border shadow">
            <h2 className="font-semibold mb-3 flex items-center justify-between text-stone-700">
              <span>Discarded Heroes</span>
              <span className="text-xs px-2 py-1 rounded-full bg-stone-200 border">{discard.length}</span>
            </h2>
            <div className="h-64 rounded-xl border bg-stone-50/70 p-2 overflow-y-auto">
              {discard.length ? (
                <ul className="text-sm text-stone-700 space-y-1 pr-1">
                  {discard.map((h) => (
                    <li key={h.id} className="truncate flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: h.color }}></span>
                      <span className="shrink-0 tabular-nums">{String(h.number).padStart(2, '0')}:</span>
                      <span className="truncate">{h.name}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-stone-500">No discards yet</span>
              )}
            </div>
          </div>
        </section>

        <section className="p-4 rounded-2xl bg-white border shadow">
          <h2 className="font-semibold mb-3">Your Team (5)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {team.map((card, i) => (
              <div key={i} className="relative">
                <div
                  onClick={() => (card ? onSlotClick(i) : undefined)}
                  className={
                    "rounded-2xl border h-48 p-3 flex items-center justify-center transition " +
                    (card ? "bg-white hover:bg-neutral-50 cursor-pointer" : "bg-rose-50 hover:bg-rose-100 border-dashed")
                  }
                >
                  {card ? (
                    <HeroCard hero={card} compact />
                  ) : (
                    <button
                      onClick={() => placeTopIntoSlot(i)}
                      disabled={!deck.length}
                      className="w-10 h-10 text-2xl leading-none rounded-xl border bg-white hover:bg-neutral-100 disabled:opacity-50 shadow-sm"
                      title="Place top card here"
                      aria-label={`Place remaining hero into slot ${i + 1}`}
                    >
                      +
                    </button>
                  )}
                </div>

                {selectedSlot === i && card && (
                  <div className="absolute inset-0 rounded-2xl bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center gap-2 p-3">
                    <div className="text-white text-sm mb-1">Swap this hero?</div>
                    <div className="flex gap-2">
                      <button onClick={swapSlot} className="px-3 py-2 rounded-xl bg-white text-black hover:bg-neutral-100 shadow">
                        Swap
                      </button>
                      <button onClick={() => setSelectedSlot(null)} className="px-3 py-2 rounded-xl border border-white/70 text-white hover:bg-white/10">
                        Keep
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-neutral-600">
              {allFiveChosen ? <span className="text-green-700">Ready to submit.</span> : <span>Select 5 heroes to continue.</span>}
            </div>
            <button onClick={submitTeam} disabled={!allFiveChosen} className="px-4 py-2 rounded-xl border bg-rose-100 hover:bg-rose-200 disabled:opacity-50 shadow">
              Submit team
            </button>
          </div>
        </section>

        {submitted && (
          <section className="p-4 rounded-2xl bg-green-50 border shadow text-green-800">Team submitted! JSON downloaded.</section>
        )}
      </div>
    </div>
  );
}

function HeroCard({ hero, label, subtle, compact }: { hero: Hero; label?: string; subtle?: boolean; compact?: boolean }) {
  const primary = hero.color || "#e11d48"; // fallback rose-600
  const secondary = hero.secondary || "#fb7185"; // rose-400
  const ring = { boxShadow: `inset 0 0 0 2px ${primary}22, 0 1px 0 0 #0001` } as React.CSSProperties;
  const grad = { background: `linear-gradient(135deg, ${primary}0D, ${secondary}1A)` } as React.CSSProperties;

  return (
    <div
      className={
        ("w-full h-full rounded-xl border p-3 shadow-sm flex flex-col justify-between " + (subtle ? "opacity-85" : "")) +
        (compact ? "" : " max-w-[280px]")
      }
      style={{ ...ring, ...grad, backgroundColor: "#fff" }}
    >
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold" style={{ color: primary }}>
          #{hero.number}
        </span>
        <span className="font-semibold tracking-wide uppercase" style={{ color: primary }}>
          {hero.category}
        </span>
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primary }}></span>
      </div>
      <div className="mt-1">
        <div className="text-lg font-bold leading-tight" style={{ color: "#111" }}>
          {hero.name}
        </div>
        {hero.tagline && (
          <div className="text-sm" style={{ color: "#4b5563" }}>
            {hero.tagline}
          </div>
        )}
      </div>
      {hero.description && <div className="text-xs text-neutral-700 mt-2">{hero.description}</div>}
    </div>
  );
}
