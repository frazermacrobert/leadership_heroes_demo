import React, { useMemo, useState } from "react";

export type Hero = { id: string; name: string; role: string; power?: string };

const SEED_HEROES: Hero[] = [
  { id: "h-01", name: "Ava Archer", role: "Navigator", power: "Sees three moves ahead" },
  { id: "h-02", name: "Ravi Reed", role: "Change Maker", power: "Turns friction into momentum" },
  { id: "h-03", name: "Maya Quinn", role: "Communicator", power: "Clarity under pressure" },
  { id: "h-04", name: "Leo Park", role: "Results Driver", power: "Ships value fast" },
  { id: "h-05", name: "Noor Ali", role: "Trust Builder", power: "Psychological safety first" },
  { id: "h-06", name: "Sofia Chen", role: "Judgement Maker", power: "Decisions with data + gut" },
  { id: "h-07", name: "Jonah West", role: "Growth Driver", power: "Experiments > opinions" },
  { id: "h-08", name: "Imani Cruz", role: "Purpose Creator", power: "Mission that motivates" },
  { id: "h-09", name: "Owen Hill", role: "Pressure Player", power: "Calm in chaos" },
  { id: "h-10", name: "Greta King", role: "Team Builder", power: "Orchestrates A‑teams" },
  { id: "h-11", name: "Xander Cole", role: "Border Crosser", power: "Bridges silos" },
  { id: "h-12", name: "Priya Rao", role: "Self‑Grower", power: "Learns loudly" },
  { id: "h-13", name: "Nia Brooks", role: "Change Maker", power: "Small bets, big wins" },
  { id: "h-14", name: "Kai Ahmed", role: "Navigator", power: "Maps uncertainty" },
  { id: "h-15", name: "Elise Hart", role: "Trust Builder", power: "Radical candor" },
  { id: "h-16", name: "Tomoko Abe", role: "Results Driver", power: "Relentless focus" },
  { id: "h-17", name: "Samir Das", role: "Communicator", power: "Story-first influence" },
  { id: "h-18", name: "Bree Nolan", role: "Pressure Player", power: "Steers the storm" },
  { id: "h-19", name: "Hana Park", role: "Team Builder", power: "Talent alchemist" },
  { id: "h-20", name: "Zoe Alba", role: "Purpose Creator", power: "Why that works" },
];

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
  a.href = url; a.download = filename; document.body.appendChild(a);
  a.click(); a.remove(); URL.revokeObjectURL(url);
}

export default function LeadershipHeroesGame() {
  const [initialised, setInitialised] = useState(false);
  const [deck, setDeck] = useState<Hero[]>([]);
  const [discard, setDiscard] = useState<Hero[]>([]);
  const [team, setTeam] = useState<(Hero | null)[]>([null, null, null, null, null]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  React.useEffect(() => {
    if (!initialised) { setDeck(shuffle(SEED_HEROES)); setInitialised(True as any as boolean); }
  }, [initialised]);

  const remainingTop = deck[deck.length - 1] || null;
  const allFiveChosen = team.every(Boolean);
  const noMoreCards = deck.length === 0;

  function placeTopIntoSlot(slotIndex: number) {
    if (!deck.length || team[slotIndex]) return;
    const top = deck[deck.length - 1];
    setTeam(t => { const next = [...t]; next[slotIndex] = top; return next; });
    setDeck(d => d.slice(0, -1));
  }

  function onSlotClick(slotIndex: number) {
    if (!team[slotIndex]) return;
    setSelectedSlot(slotIndex === selectedSlot ? null : slotIndex);
  }

  function keepSlot() { setSelectedSlot(null); }

  function swapSlot() {
    if (selectedSlot === null || !deck.length) return;
    setTeam(t => {
      const next = [...t];
      const outgoing = next[selectedSlot]!;
      const top = deck[deck.length - 1];
      setDiscard(d => [outgoing, ...d]);
      next[selectedSlot] = top;
      return next;
    });
    setDeck(d => d.slice(0, -1)); setSelectedSlot(null);
  }

  function discardTop() {
    if (!deck.length) return;
    const top = deck[deck.length - 1];
    setDeck(d => d.slice(0, -1)); setDiscard(d => [top, ...d]);
  }

  function restart() {
    if (!discard.length) return;
    setDeck(d => [...d, ...shuffle(discard)]); setDiscard([]);
  }

  function resetAll() {
    setDeck(shuffle(SEED_HEROES)); setDiscard([]);
    setTeam([null, null, null, null, null]); setSelectedSlot(null); setSubmitted(false);
  }

  function submitTeam() {
    if (!allFiveChosen) return;
    setSubmitted(true); downloadJSON("team-of-5-heroes.json", team.filter(Boolean));
  }

  const instructions = useMemo(() => (
    <div className="space-y-2 text-sm leading-relaxed">
      <p>Build your team of <span className="font-semibold">five super‑leaders</span>. Browse, place, and swap.</p>
      <ul className="list-disc ml-5 space-y-1">
        <li>Click <span className="font-semibold">+</span> on a slot to place the top card from Remaining Heroes.</li>
        <li>Click a filled slot to <span className="font-semibold">Swap</span> (takes next top card) or <span className="font-semibold">Keep</span>.</li>
        <li>When you have five heroes, hit <span className="font-semibold">Submit team</span> to download your JSON.</li>
      </ul>
    </div>
  ), []);

  return (
    <div className="min-h-screen w-full bg-neutral-50 text-neutral-900 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Leadership Heroes — Team Builder</h1>
            <p className="text-neutral-600 mt-1">Modern, sleek, and demo‑ready UI.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setDeck(shuffle(deck))} className="px-3 py-2 rounded-xl border bg-white hover:bg-neutral-100 shadow-sm">Shuffle Remaining</button>
            <button onClick={resetAll} className="px-3 py-2 rounded-xl border bg-white hover:bg-neutral-100 shadow-sm">Reset All</button>
          </div>
        </header>

        <section className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="p-4 rounded-2xl bg-white border shadow-sm">{instructions}</div>
          </div>
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 border shadow-sm">
            <p className="text-sm text-neutral-700"><span className="font-semibold">Demo tip:</span> You can discard the top card without placing it.</p>
            <div className="mt-3 flex gap-2">
              <button onClick={discardTop} disabled={!deck.length} className="px-3 py-2 rounded-xl border bg-white hover:bg-neutral-100 disabled:opacity-50 shadow-sm">Discard Top</button>
              {noMoreCards && (<>
                <button onClick={restart} className="px-3 py-2 rounded-xl border bg-white hover:bg-neutral-100 shadow-sm">Restart (bring back discards)</button>
                <button onClick={submitTeam} disabled={!allFiveChosen} className="px-3 py-2 rounded-xl border bg-white hover:bg-neutral-100 disabled:opacity-50 shadow-sm">Submit team</button>
              </>)}
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-6">
          <div className="p-4 rounded-2xl bg-white border shadow-sm">
            <h2 className="font-semibold mb-3 flex items-center justify-between">
              <span>Remaining Heroes</span>
              <span className="text-xs px-2 py-1 rounded-full bg-neutral-100 border">{deck.length}</span>
            </h2>
            <div className="h-40 rounded-xl border-2 border-dashed flex items-center justify-center relative">
              {remainingTop ? (<CardPreview hero={remainingTop} label="Top of Pile" />) : (<span className="text-neutral-500">No more cards</span>)}
            </div>
            {!noMoreCards && (<p className="text-xs text-neutral-500 mt-2">Place with "+" on a slot, or Discard Top.</p>)}
          </div>

          <div className="p-4 rounded-2xl bg-white border shadow-sm">
            <h2 className="font-semibold mb-3 flex items-center justify-between">
              <span>Discarded Heroes</span>
              <span className="text-xs px-2 py-1 rounded-full bg-neutral-100 border">{discard.length}</span>
            </h2>
            <div className="h-40 rounded-xl border-2 border-dashed flex items-center justify-center">
              {discard.length ? (<CardPreview hero={discard[0]} label="Top of Discard" subtle />) : (<span className="text-neutral-500">No discards yet</span>)}
            </div>
          </div>
        </section>

        <section className="p-4 rounded-2xl bg-white border shadow-sm">
          <h2 className="font-semibold mb-3">Your Team (5)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {team.map((card, i) => (
              <div key={i} className="relative">
                <div onClick={() => (card ? onSlotClick(i) : undefined)}
                     className={"rounded-2xl border h-44 p-3 flex items-center justify-center cursor-pointer transition " + (card ? "bg-white hover:bg-neutral-50" : "bg-neutral-50 hover:bg-neutral-100 border-dashed")}>
                  {card ? (<CardPreview hero={card} compact />) : (
                    <button onClick={() => placeTopIntoSlot(i)} disabled={!deck.length}
                            className="w-10 h-10 text-2xl leading-none rounded-xl border bg-white hover:bg-neutral-100 disabled:opacity-50 shadow-sm" title="Place top card here">+</button>
                  )}
                </div>

                {selectedSlot === i and card and (
                  <div className="absolute inset-0 rounded-2xl bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center gap-2 p-3">
                    <div className="text-white text-sm mb-1">Swap this hero?</div>
                    <div className="flex gap-2">
                      <button onClick={swapSlot} disabled={!deck.length} className="px-3 py-2 rounded-xl bg-white text-black hover:bg-neutral-100 disabled:opacity-50">Swap (takes next card)</button>
                      <button onClick={() => setSelectedSlot(null)} className="px-3 py-2 rounded-xl bg-transparent border border-white/70 text-white hover:bg-white/10">Keep</button>
                    </div>
                    {!deck.length && (<div className="text-xs text-white/80 mt-1">No remaining cards to swap in.</div>)}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-neutral-600">{allFiveChosen ? (<span className="text-green-700">Ready to submit.</span>) : (<span>You have not selected all 5 cards yet.</span>)}</div>
            <div className="flex gap-2">
              <button onClick={submitTeam} disabled={!allFiveChosen} className="px-4 py-2 rounded-xl border bg-white hover:bg-neutral-100 disabled:opacity-50 shadow-sm">Submit team</button>
            </div>
          </div>
        </section>

        {submitted && (
          <section className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-sm">
            <div className="font-semibold">Team submitted</div>
            <p className="text-sm text-emerald-900 mt-1">Your JSON has downloaded. Share it, or reset to try again.</p>
          </section>
        )}

        <footer className="text-xs text-neutral-500 pt-2">Built for the leadership heroes demo. Replace the seeded deck with your real data.</footer>
      </div>
    </div>
  );
}

function CardPreview({ hero, label, subtle, compact }: { hero: Hero; label?: string; subtle?: boolean; compact?: boolean }) {
  return (
    <div className={("w-full h-full rounded-xl border p-3 shadow-sm flex flex-col items-start justify-between bg-white " + (subtle ? "opacity-80" : "")) + (compact ? "" : " max-w-[260px]") }>
      <div className="text-xs text-neutral-500">{label}</div>
      <div>
        <div className="text-base font-semibold leading-tight">{hero.name}</div>
        <div className="text-sm text-neutral-600">{hero.role}</div>
      </div>
      {hero.power && <div className="text-xs text-neutral-500 mt-2 line-clamp-2">{hero.power}</div>}
    </div>
  );
}
