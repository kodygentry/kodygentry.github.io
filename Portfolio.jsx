import React from "react";
import { motion, AnimatePresence, useMotionTemplate, useMotionValue } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { ExternalLink, Star, GitFork, Gamepad2, Code2, Paintbrush } from "lucide-react";

const FONT_CLASS = "[font-family:'Roboto_Mono',ui-monospace,Menlo,Monaco,Consolas,'Liberation_Mono','Courier_New',monospace]";

const GITHUB_USER = "kodygentry";
const ITCH_USER = "chumstudios";

const socials = [
  { label: "GitHub", href: `https://github.com/${GITHUB_USER}` },
  { label: "Email", href: "mailto:kodygentry3737@gmail.com" },
];

const ITCH_FALLBACK = {
  [`https://${ITCH_USER}.itch.io/midnight-slice-demo`]: { title: "Midnight Slice Demo", blurb: "It's time for a midnight slice.", cover: null },
  [`https://${ITCH_USER}.itch.io/eternal-burn`]: { title: "Eternal Burn", blurb: "Fast-paced platformer jam entry.", cover: null },
};
const gameLinks = Object.keys(ITCH_FALLBACK);

const SIDE_OVERRIDE = new Set(["SimpleAPI","Marvel-Rivals-Discord-Stat-Bot","KimoTune","Advent-Of-Code-2023"]);
const GAME_OVERRIDE = new Set(["DevQuest","godot-dot-shader"]);
const SCHOOL_HINTS = ["assembly","mips","x86","arm","object oriented","oop","data structures","algorithms","cs","class","assignment","lab","university","college","school","project","semester","spring","fall"];
const SCHOOL_LANGS = ["C","C++","Assembly","Makefile"];

// ---------------------------------
// Background
// ---------------------------------
const CosmicBG = () => (
  <div className="pointer-events-none absolute inset-0 -z-10">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.20),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.15),transparent_55%)]" />
    <div className="absolute inset-0 opacity-[0.08]" style={{
      backgroundImage:
        "radial-gradient(1px 1px at 20% 30%, #fff 50%, transparent 51%),radial-gradient(1px 1px at 70% 80%, #fff 50%, transparent 51%),radial-gradient(1px 1px at 40% 60%, #fff 50%, transparent 51%),radial-gradient(1px 1px at 85% 25%, #fff 50%, transparent 51%),radial-gradient(1px 1px at 10% 80%, #fff 50%, transparent 51%)",
      backgroundSize: "1200px 1200px, 1000px 1000px, 800px 800px, 1400px 1400px, 900px 900px"
    }} />
    <div className="absolute bottom-0 left-0 right-0 h-[40vh] [perspective:800px]">
      <div className="absolute inset-0 origin-bottom transform-gpu rotateX-60 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent" />
    </div>
    <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[length:100%_2px]" />
  </div>
);

// ---------------------------------
// CRT TERMINAL INTRO (dot dithering + scanlines + barrel warp)
// ---------------------------------
function CRTTerminalIntro({ onEnter }) {
  const [boot, setBoot] = React.useState(false);
  const [step, setStep] = React.useState(0); // staged terminal lines
  const prefersReduced = React.useMemo(() => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);

  const handleEnter = React.useCallback(() => {
    if (prefersReduced) return onEnter();
    setBoot(true);
    setTimeout(onEnter, 1400);
  }, [prefersReduced, onEnter]);

  React.useEffect(() => {
    const onKey = (e) => {
      const k = e.key?.toLowerCase?.();
      if (k === 'enter' || k === ' ') handleEnter();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleEnter]);

  // staged type-on lines
  React.useEffect(() => {
    if (boot) return; // stop typing once booting
    const t1 = setTimeout(() => setStep(1), 250);
    const t2 = setTimeout(() => setStep(2), 700);
    const t3 = setTimeout(() => setStep(3), 1100);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [boot]);

  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-label="Press to enter"
      onClick={handleEnter}
      onKeyDown={(e)=>{ if (e.key==='Enter' || e.key===' ') handleEnter(); }}
      initial={{ opacity: 1 }}
      animate={{ opacity: boot ? 0 : 1 }}
      transition={{ duration: 0.6, ease: 'easeInOut', delay: boot ? 0.8 : 0 }}
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/95"
    >
      {/* SVG filter for barrel warp at boot */}
      <svg className="absolute h-0 w-0">
        <filter id="crt-warp" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.0012 0.0016" numOctaves="2" seed="2" result="noise">
            {boot && (<animate attributeName="baseFrequency" dur="1s" values="0.0012 0.0016;0.02 0.03;0.0008 0.0012" keyTimes="0;0.6;1" fill="freeze" />)}
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="0">
            {boot && (<animate attributeName="scale" dur="1s" values="0;65;0" keyTimes="0;0.55;1" fill="freeze" />)}
          </feDisplacementMap>
        </filter>
      </svg>

      {/* Terminal frame */}
      <motion.div
        style={{ filter: boot ? 'url(#crt-warp)' : 'none' }}
        animate={boot ? { skewX: [0, 1.2, -0.8, 0], scale: [1, 1.03, 1.05, 1] } : {}}
        transition={{ duration: 1.1, ease: 'easeInOut' }}
        className="relative mx-4 w-[min(860px,92vw)] rounded-[22px] border border-white/10 bg-slate-950 p-0 shadow-2xl"
      >
        {/* Dot-mask dithering */}
        <div className="pointer-events-none absolute inset-0 rounded-[22px] opacity-[0.08] mix-blend-soft-light"
             style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '3px 3px' }} />
        {/* Scanlines */}
        <div className="pointer-events-none absolute inset-0 rounded-[22px] opacity-25 mix-blend-overlay bg-[repeating-linear-gradient(to_bottom,rgba(255,255,255,0.08)_0,rgba(255,255,255,0.08)_1px,transparent_3px,transparent_4px)]" />
        {/* Vignette */}
        <div className="pointer-events-none absolute inset-0 rounded-[22px] shadow-[inset_0_0_120px_rgba(0,0,0,0.9)]" />

        {/* Header bar */}
        <div className="flex items-center justify-between rounded-t-[22px] bg-slate-900/80 px-4 py-2 text-[10px] text-blue-200/80">
          <div className="tracking-widest">CHUM/TERM v1.0</div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-green-400/80" />
            <span className="inline-block h-2 w-2 rounded-full bg-yellow-300/80" />
            <span className="inline-block h-2 w-2 rounded-full bg-red-400/80" />
          </div>
        </div>

        {/* Terminal body */}
        <div className="relative z-10 px-6 py-6 font-mono text-[13px] leading-relaxed text-blue-100/90">
          <div className="mb-2 text-blue-300/80">$ init --profile kody</div>
          <AnimatePresence>
            {step >= 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }} className="text-blue-200/90">
                ✓ loaded modules: <span className="text-blue-100">game-dev</span>, <span className="text-blue-100">software</span>, <span className="text-blue-100">3d-art</span>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {step >= 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35, delay: 0.05 }} className="text-blue-200/90">
                ✓ network: <span className="text-blue-100">github.com/{GITHUB_USER}</span> · <span className="text-blue-100">itch.io/{ITCH_USER}</span>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {step >= 3 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35, delay: 0.05 }} className="mt-3 text-blue-100">
                <span className="opacity-80">Press any key or click to continue_</span>
                <span className="ml-1 inline-block h-4 w-2 animate-pulse bg-blue-300/80 align-middle" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Outer glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.10),transparent_60%)]" />
    </motion.div>
  );
}

// ---------------------------------
// Hero Card (unchanged)
// ---------------------------------
function HeroCard() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useMotionTemplate`${y}deg`;
  const rotateY = useMotionTemplate`${x}deg`;

  function onMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = e.clientX - rect.left - rect.width / 2;
    const dy = e.clientY - rect.top - rect.height / 2;
    x.set((dx / rect.width) * 6);
    y.set((-dy / rect.height) * 6);
  }

  return (
    <motion.div onMouseMove={onMove} onMouseLeave={() => { x.set(0); y.set(0); }} style={{ transformStyle: "preserve-3d", rotateX, rotateY }} className="relative w-full max-w-3xl">
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-400/30 via-blue-500/30 to-indigo-400/30 blur-xl" />
      <div className="relative rounded-3xl border border-white/15 bg-white/10 p-10 text-center shadow-2xl backdrop-blur-xl">
        <div className="mx-auto mb-4 flex items-center justify-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/20 ring-1 ring-white/20"><Gamepad2 className="h-5 w-5"/></div>
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-500/20 ring-1 ring-white/20"><Code2 className="h-5 w-5"/></div>
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-500/20 ring-1 ring-white/20"><Paintbrush className="h-5 w-5"/></div>
        </div>
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-blue-100">Kody Gentry</h1>
        <p className="mt-1 text-base sm:text-lg font-medium text-blue-200/90">Software Dev · Game Dev · 3D Artist</p>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-300">Founder of Chum Studios</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {socials.map(({ label, href }) => (
            <Button key={label} asChild variant="secondary" className="rounded-full bg-slate-800/60 text-white hover:bg-blue-500/30"><a href={href} target="_blank" rel="noreferrer">{label}</a></Button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------
// Cards
// ---------------------------------
function TypeIcon({ type }) {
  if (type === "game") return <Gamepad2 className="h-4 w-4 text-fuchsia-300" />;
  if (type === "school") return <Paintbrush className="h-4 w-4 text-teal-300" />;
  return <Code2 className="h-4 w-4 text-blue-300" />;
}

function SoftwareCard({ title, blurb, tags, href, stars, forks, type }) {
  return (
    <div className="group relative h-full">
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-blue-500/20 via-cyan-400/10 to-indigo-500/20 opacity-0 blur transition group-hover:opacity-100" />
      <Card className="relative flex h-full min-h-[240px] flex-col overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-b from-slate-900/70 to-slate-900/40 p-0 shadow-xl backdrop-blur-lg ring-1 ring-white/10 transition-transform group-hover:-translate-y-0.5">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-start gap-2 text-base text-white">
            <TypeIcon type={type} />
            <span className="leading-tight">{title}</span>
          </CardTitle>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {typeof stars === "number" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-800/70 px-2 py-0.5 text-xs text-white/90"><Star className="h-3 w-3"/> {stars}</span>
            )}
            {typeof forks === "number" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-800/70 px-2 py-0.5 text-xs text-white/90"><GitFork className="h-3 w-3"/> {forks}</span>
            )}
            {href && (
              <Button asChild size="sm" variant="secondary" className="rounded-full bg-slate-800/60 text-white/90 hover:bg-blue-500/30"><a href={href} target="_blank" rel="noreferrer"><ExternalLink className="mr-1 h-4 w-4"/>View</a></Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="mt-auto space-y-3">
          <p className="text-sm text-slate-200/85">{blurb}</p>
          <div className="flex flex-wrap gap-2">
            {tags?.map((t) => (<Badge key={t} className="rounded-full bg-slate-800/60 text-white/90">{t}</Badge>))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function GameCard({ title, blurb, tags, href, cover }) {
  const [imgFailed, setImgFailed] = React.useState(false);
  const showCover = cover && !imgFailed;
  return (
    <div className="group relative h-full">
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-fuchsia-500/20 via-violet-400/10 to-indigo-500/20 opacity-0 blur transition group-hover:opacity-100" />
      <Card className="relative flex h-full min-h-[280px] flex-col overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-b from-slate-900/70 to-slate-900/40 p-0 shadow-xl backdrop-blur-lg ring-1 ring-white/10 transition-transform group-hover:-translate-y-0.5">
        <div className="aspect-video w-full overflow-hidden bg-slate-900/40">
          {showCover ? (
            <img src={cover} alt="cover" className="h-full w-full object-cover" loading="lazy" onError={() => setImgFailed(true)} />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-400"><Gamepad2 className="h-8 w-8" /></div>
          )}
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-white">{title}</CardTitle>
        </CardHeader>
        <CardContent className="mt-auto space-y-3">
          <p className="text-sm text-slate-200/85">{blurb}</p>
          <div className="flex flex-wrap gap-2">
            {tags?.map((t) => (<Badge key={t} className="rounded-full bg-slate-800/60 text-white/90">{t}</Badge>))}
          </div>
          {href && (
            <div>
              <Button asChild size="sm" variant="secondary" className="rounded-full bg-slate-800/60 text-white/90 hover:bg-blue-500/30"><a href={href} target="_blank" rel="noreferrer"><ExternalLink className="mr-1 h-4 w-4"/>Play</a></Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ---------------------------------
// Data hooks
// ---------------------------------
function useGithubRepos(username, sortBy = "stars") {
  const [repos, setRepos] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    let abort = new AbortController();
    async function run() {
      setLoading(true);
      try {
        const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, { signal: abort.signal, headers: { Accept: "application/vnd.github+json" } });
        if (!res.ok) throw new Error(`GitHub ${res.status}`);
        const data = await res.json();
        const filtered = data.filter((r) => !r.fork);
        const withDesc = filtered.map((r) => ({ title: r.name, blurb: r.description || "No description", tags: [r.language].filter(Boolean), href: r.html_url, stars: r.stargazers_count, forks: r.forks_count, pushed_at: r.pushed_at }));
        let all = withDesc;
        if (sortBy === "stars") all.sort((a, b) => (b.stars || 0) - (a.stars || 0));
        else all.sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));
        setRepos(all.slice(0, 50));
      } catch (e) { if (e.name !== "AbortError") setError(e); } finally { setLoading(false); }
    }
    run();
    return () => abort.abort();
  }, [username, sortBy]);

  return { repos, loading, error };
}

function useItchCovers(urls) {
  const [games, setGames] = React.useState(urls.map((u) => {
    const f = ITCH_FALLBACK[u] || {}; return { href: u, title: f.title || u, blurb: f.blurb || "Play on itch.io", cover: f.cover || null };
  }));
  React.useEffect(() => {
    let alive = true;
    async function run() {
      const results = await Promise.all(urls.map(async (u) => {
        try {
          const res = await fetch(`https://itch.io/oembed?url=${encodeURIComponent(u)}`);
          if (res.ok) {
            const j = await res.json();
            return { href: u, title: j.title || (ITCH_FALLBACK[u]?.title || u), blurb: j.author_name ? `by ${j.author_name}` : (ITCH_FALLBACK[u]?.blurb || "Play on itch.io"), cover: j.thumbnail_url || ITCH_FALLBACK[u]?.cover || null };
          }
        } catch {}
        return ITCH_FALLBACK[u] ? { href: u, ...ITCH_FALLBACK[u] } : { href: u, title: u, blurb: "Play on itch.io", cover: null };
      }));
      if (alive) setGames(results);
    }
    run();
    return () => { alive = false; };
  }, [urls.join("|")]);
  return games;
}

// ---------------------------------
// Helpers
// ---------------------------------
function categorizeRepo(r) {
  if (GAME_OVERRIDE.has(r.title)) return "game";
  if (SIDE_OVERRIDE.has(r.title)) return "side";
  const name = (r.title || "").toLowerCase();
  const desc = (r.blurb || "").toLowerCase();
  const lang = (r.tags && r.tags[0]) || "";
  const hasHint = SCHOOL_HINTS.some((k) => name.includes(k) || desc.includes(k));
  const langHint = SCHOOL_LANGS.includes(lang);
  return hasHint || langHint ? "school" : "side";
}

function groupByType(repos) {
  const out = { school: [], side: [], game: [] };
  for (const r of repos) {
    const type = categorizeRepo(r);
    out[type].push({ ...r, type });
  }
  return out;
}

// ---------------------------------
// MAIN
// ---------------------------------
export default function Portfolio() {
  const [entered, setEntered] = React.useState(false);
  const { repos, loading, error } = useGithubRepos(GITHUB_USER, "stars");
  const games = useItchCovers(gameLinks);
  const grouped = React.useMemo(() => groupByType(repos), [repos]);

  return (
    <div className={`min-h-screen w-full ${FONT_CLASS} bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 text-white`}>
      <CosmicBG />
      <AnimatePresence>{!entered && <CRTTerminalIntro onEnter={() => setEntered(true)} />}</AnimatePresence>

      <main aria-hidden={!entered} className={`${!entered ? 'pointer-events-none select-none blur-sm' : ''}`}>
        <header className="mx-auto max-w-6xl px-4 py-14">
          <div className="flex flex-col items-center gap-8 text-center"><HeroCard /></div>
        </header>

        <section className="mx-auto mb-20 max-w-6xl px-4">
          <Tabs defaultValue="software" className="w-full">
            <TabsList className="grid w-full grid-cols-3 rounded-2xl bg-slate-900/70 backdrop-blur-lg">
              <TabsTrigger value="software" className="rounded-xl text-blue-200">Software</TabsTrigger>
              <TabsTrigger value="games" className="rounded-xl text-blue-200">Games</TabsTrigger>
              <TabsTrigger value="art" className="rounded-xl text-blue-200">3D / Art</TabsTrigger>
            </TabsList>

            <TabsContent value="software" className="mt-6">
              {loading && (<SoftwareCard title="Loading repositories…" blurb={`Fetching from GitHub @${GITHUB_USER}`} tags={["GitHub API"]} type="side" />)}
              {error && (<SoftwareCard title="GitHub fetch failed" blurb={`${error}`} tags={["Error"]} type="side" />)}

              {!loading && !error && (
                <Accordion type="single" collapsible className="space-y-5">
                  <AccordionItem value="side">
                    <AccordionTrigger className="rounded-xl bg-slate-900/60 px-4 py-3 text-left text-blue-100">Side projects</AccordionTrigger>
                    <AccordionContent>
                      {grouped.side.length === 0 ? (
                        <p className="px-1 py-3 text-sm text-slate-400">No side projects found.</p>
                      ) : (
                        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 auto-rows-[1fr]">
                          {grouped.side.map((p) => (<SoftwareCard key={p.title} {...p} />))}
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="school">
                    <AccordionTrigger className="rounded-xl bg-slate-900/60 px-4 py-3 text-left text-blue-100">School projects</AccordionTrigger>
                    <AccordionContent>
                      {grouped.school.length === 0 ? (
                        <p className="px-1 py-3 text-sm text-slate-400">None detected yet — add keywords like “Assembly”, “OOP”, etc.</p>
                      ) : (
                        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 auto-rows-[1fr]">
                          {grouped.school.map((p) => (<SoftwareCard key={p.title} {...p} />))}
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="game">
                    <AccordionTrigger className="rounded-xl bg-slate-900/60 px-4 py-3 text-left text-blue-100">Game dev (code repos)</AccordionTrigger>
                    <AccordionContent>
                      {grouped.game.length === 0 ? (
                        <p className="px-1 py-3 text-sm text-slate-400">No game dev repos found.</p>
                      ) : (
                        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 auto-rows-[1fr]">
                          {grouped.game.map((p) => (<SoftwareCard key={p.title} {...p} />))}
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
            </TabsContent>

            <TabsContent value="games" className="mt-6">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 auto-rows-[1fr]">
                {games.map((g) => (
                  <GameCard key={g.href} title={g.title} blurb={g.blurb} tags={["itch.io"]} href={g.href} cover={g.cover} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="art" className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 auto-rows-[1fr]">
              <GameCard title="3D Props & Environments" blurb="Assorted low-poly props and moody environment studies." tags={["Blender", "Game Art"]} />
            </TabsContent>
          </Tabs>
        </section>
      </main>

      <footer className="mx-auto max-w-6xl px-4 pb-10">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} Kody Gentry · Chum Studios</p>
          <div className="text-xs text-slate-400">CRT terminal intro · Dot-dither + scanlines · Warp</div>
        </div>
      </footer>
    </div>
  );
}
