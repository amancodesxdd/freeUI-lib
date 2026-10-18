import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import GradientText from "./GradientText";
import MotionTabs from "./MotionTabs";
import TeamStack from "./TeamStack";
import PinnedList from "./PinnedList";
import AnimatedInput from "./AnimatedInput";
import TiltCard from "./TiltCard";
import { AnimateCountDemo } from "./AnimateCount";
import { MotionAccordion, FAQ_ITEMS } from "./MotionAccordion";
import { VercelSnapText, SNAP_ITEMS } from "./VercelSnapText";
import { Matrix, MatrixVuDemo, matrixSource } from "./Matrix";
import ComponentCard from "./ComponentCard";
import { COMPONENT_LIST } from "./registry";
import { EASES } from "./motion-presets";

const CURSORS = ["line", "block", "glow"];

const TIERS = [
  { id: "all", label: "All" },
  { id: "free", label: "Free" },
  { id: "pro", label: "Pro" },
];

const SORTS = [
  { id: "default", label: "Default" },
  { id: "newest", label: "Newest" },
];

const CARD_PREVIEW = {
  "dia-text-reveal": "card",
  "animated-input": "card",
  "animate-count": "card",
};

const time = (date) => new Date(date).getTime() || 0;

export default function Home({ demo }) {
  const {
    mode,
    shine,
    runKey,
    stops,
    shineColor,
    reduced,
    go,
    settings,
  } = demo;

  const [query, setQuery] = useState("");
  const [tier, setTier] = useState("all");
  const [sort, setSort] = useState("default");

  const cards = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = COMPONENT_LIST.filter((c) => {
      const hit =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.kicker.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q);
      const inTier = tier === "all" || (c.tier ?? "free") === tier;
      return hit && inTier;
    });
    return sort === "newest"
      ? [...list].sort((a, b) => time(b.date) - time(a.date))
      : list;
  }, [query, tier, sort]);

  const reset = () => {
    setQuery("");
    setTier("all");
    setSort("default");
  };

  const preview = (id) => {
    if (id === "floating-tab-bar") return <MotionTabs reduced={reduced} />;
    if (id === "team-stack") return <TeamStack reduced={reduced} />;
    if (id === "pinned-list") return <PinnedList reduced={reduced} />;
    if (id === "tilt-card") {
      return (
        <div className="tc-mini">
          <TiltCard
            title="Starter Kit"
            description="Everything you need to ship fast."
            price="Free"
            badgeLabel="Popular"
            badgeVariant={settings.variant === 1 ? "warning" : "success"}
            reduced={reduced}
          />
          <TiltCard
            title="Pro Template"
            description="Advanced tools for growing teams."
            price="$49"
            reduced={reduced}
          />
          <TiltCard
            title="Enterprise"
            description="SSO, audit logs and more."
            price="$199"
            badgeLabel="Best value"
            badgeVariant="warning"
            reduced={reduced}
          />
        </div>
      );
    }
    if (id === "matrix") {
      const src = matrixSource(settings.matrixPreset);
      if (src.vu) {
        return (
          <MatrixVuDemo
            rows={src.rows}
            cols={src.cols}
            size={settings.pixelSize}
            gap={settings.pixelGap}
            brightness={settings.brightness}
            reduced={reduced}
          />
        );
      }
      return (
        <Matrix
          rows={src.rows}
          cols={src.cols}
          pattern={src.pattern}
          frames={src.frames}
          fps={settings.matrixFps}
          size={settings.pixelSize}
          gap={settings.pixelGap}
          brightness={settings.brightness}
          reduced={reduced}
        />
      );
    }
    if (id === "vercel-snap-text") {
      return (
        <VercelSnapText
          key={`snap-${settings.stiffness}`}
          items={SNAP_ITEMS}
          prefix="We Design"
          className="vst-preview"
          itemHeight={Math.min(settings.itemHeight, 72)}
          prefixGap={settings.prefixGap}
          showNeighbors={settings.showNeighbors}
          stiffness={settings.stiffness}
          damping={28}
          reduced={reduced}
        />
      );
    }
    if (id === "motion-faqs-accordion") {
      return (
        <MotionAccordion
          items={FAQ_ITEMS}
          gap={settings.variant === 1 ? 6 : 10}
          reduced={reduced}
        />
      );
    }
    if (id === "animate-count") {
      return (
        <AnimateCountDemo
          animate={settings.variant !== 1}
          ease={EASES[settings.ease]}
        />
      );
    }
    if (id === "animated-input") {
      return (
        <AnimatedInput
          placeholder="Type something…"
          autoType
          cursorVariant={CURSORS[settings.variant] ?? "line"}
          blinkSpeed={Math.round(1000 - settings.duration * 480)}
        />
      );
    }
    return (
      <GradientText
        text="Never stop iterating."
        mode={mode}
        stops={stops}
        runKey={runKey}
        shine={shine}
        shineColor={shineColor}
        reduced={reduced}
        bandBase={0.76}
      />
    );
  };

  return (
    <>
      <section className="hero">
        <h1 className="hero-title">Design Made Easy.</h1>
        <p className="hero-sub">
          Components shaped with care, motion, and restraint.
        </p>

        <div className="hero-controls">
          <label className="hero-search">
            <Search size={18} strokeWidth={2} aria-hidden="true" />
            <input
              type="search"
              value={query}
              placeholder="Search… (or just explore)"
              aria-label="Search components"
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>

          <div className="hero-filters">
            <div className="filter-group" role="group" aria-label="Filter by tier">
              {TIERS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={tier === t.id ? "filter-btn active" : "filter-btn"}
                  onClick={() => setTier(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="filter-group" role="group" aria-label="Sort components">
              {SORTS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={sort === s.id ? "filter-btn active" : "filter-btn"}
                  onClick={() => setSort(s.id)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {cards.length ? (
        <div className="gallery">
          {cards.map((c) => (
            <ComponentCard
              key={c.id}
              title={c.title}
              preview={CARD_PREVIEW[c.id] ?? "tile tall"}
              wide={c.id === "pinned-list"}
              onOpen={() => go(`components/${c.id}`)}
            >
              {preview(c.id)}
            </ComponentCard>
          ))}
        </div>
      ) : tier === "pro" ? (
        <div className="gallery-empty">
          <p className="gallery-empty-lead">
            Nothing to buy, just use freely.
          </p>
          <button type="button" className="pill" onClick={reset}>
            Show everything
          </button>
        </div>
      ) : (
        <div className="gallery-empty">
          <p>No components match your filters.</p>
          <button type="button" className="pill" onClick={reset}>
            Reset filters
          </button>
        </div>
      )}
    </>
  );
}
