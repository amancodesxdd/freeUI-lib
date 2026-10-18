import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Check,
  Code2,
  Copy,
  Link as LinkIcon,
  Maximize2,
  Minimize2,
  Moon,
  RotateCcw,
  SlidersHorizontal,
  Sun,
} from "lucide-react";
import GradientText from "./GradientText";
import MotionTabs from "./MotionTabs";
import TeamStack from "./TeamStack";
import PinnedList from "./PinnedList";
import AnimatedInput, { CURSOR_VARIANTS } from "./AnimatedInput";
import TiltCard, { TILT_PREVIEW_IMG } from "./TiltCard";
import { AnimateCountDemo } from "./AnimateCount";
import { MotionAccordion, FAQ_ITEMS } from "./MotionAccordion";
import { VercelSnapText, SNAP_ITEMS } from "./VercelSnapText";
import { Matrix, MatrixVuDemo, matrixSource } from "./Matrix";
import InstallBlock from "./InstallBlock";
import FileTree from "./FileTree";
import SettingsPanel from "./SettingsPanel";
import { EASES, springFor } from "./motion-presets";
import { REGISTRY } from "./registry";
import { PALETTES, CUSTOM_PRESET, stopsToCss } from "./palettes";

const PALETTE_OPTIONS = [
  { id: "dia", label: "Dia" },
  { id: "aurora", label: "Aurora" },
  { id: "ember", label: "Ember" },
  { id: "custom", label: "Custom" },
];

const MODES = [
  { id: "typewriter", label: "Write-on" },
  { id: "sweep", label: "Wavefront" },
  { id: "pop", label: "Spring pop" },
];

function Preview({ entry, demo, scale }) {
  const {
    mode,
    runKey,
    stops,
    shineColor,
    shine,
    lines,
    reduced,
    settings,
  } = demo;

  if (entry.controls === "tabs") {
    return <MotionTabs reduced={reduced} settings={settings} />;
  }
  if (entry.controls === "team") {
    return <TeamStack reduced={reduced} settings={settings} />;
  }
  if (entry.controls === "pins") {
    return <PinnedList reduced={reduced} settings={settings} />;
  }
  if (entry.controls === "card") {
    const tiltProps = {
      springOptions: springFor(settings.ease, settings.duration),
    };

    return (
      <div className="tc-demo">
        <TiltCard
          title="Starter Kit"
          description="Everything you need to ship a modern SaaS product fast."
          price="Free"
          badgeLabel="Popular"
          badgeVariant={settings.variant === 1 ? "warning" : "success"}
          imageSrc={TILT_PREVIEW_IMG}
          imageAlt="dashboard preview"
          reduced={reduced}
          tiltProps={tiltProps}
        />
        <TiltCard
          title="Pro Template"
          description="Advanced features for power users and growing teams."
          price="$49"
          imageSrc={TILT_PREVIEW_IMG}
          imageAlt="analytics preview"
          reduced={reduced}
          tiltProps={tiltProps}
        />
        <TiltCard
          title="Enterprise"
          description="SSO, audit logs, and dedicated infrastructure."
          price="$199"
          badgeLabel="Best value"
          badgeVariant="warning"
          reduced={reduced}
          tiltProps={tiltProps}
        >
          <ul>
            <li>✓ Unlimited seats</li>
            <li>✓ Priority support</li>
            <li>✓ Custom domain</li>
          </ul>
        </TiltCard>
      </div>
    );
  }
  if (entry.controls === "matrix") {
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
  if (entry.controls === "snap") {
    return (
      <VercelSnapText
        key={`snap-${settings.stiffness}`}
        items={SNAP_ITEMS}
        prefix="We Design"
        className="vst-demo"
        itemHeight={settings.itemHeight}
        prefixGap={settings.prefixGap}
        showNeighbors={settings.showNeighbors}
        stiffness={settings.stiffness}
        damping={28}
        reduced={reduced}
      />
    );
  }
  if (entry.controls === "faq") {
    return (
      <MotionAccordion
        items={FAQ_ITEMS}
        gap={settings.variant === 1 ? 6 : 10}
        reduced={reduced}
        spring={springFor(settings.ease, settings.duration)}
      />
    );
  }
  if (entry.controls === "count") {
    return (
      <AnimateCountDemo
        animate={settings.variant !== 1}
        duration={settings.duration}
        ease={EASES[settings.ease]}
      />
    );
  }
  if (entry.controls === "input") {
    return (
      <AnimatedInput
        placeholder="Type something…"
        autoType
        autoText={lines[0] || "Ship it, then ship it better."}
        cursorVariant={CURSOR_VARIANTS[settings.variant] ?? "line"}
        blinkSpeed={Math.round(1000 - settings.duration * 480)}
        caretSpring={springFor(settings.ease, settings.duration)}
        caretWidth={settings.variant === 1 ? 22 : 2}
      />
    );
  }

  return (
    <div className="preview-text" style={{ fontSize: `${scale}px` }}>
      <GradientText
        text={lines[0] || " "}
        mode={mode}
        stops={stops}
        runKey={runKey}
        shine={shine}
        shineColor={shineColor}
        reduced={reduced}
        bandBase={0.76}
        duration={settings.duration}
        ease={settings.ease}
        repeat={settings.repeat}
        rtl={settings.variant === 1}
      />
    </div>
  );
}

export default function ComponentPage({ slug, demo, theme, toggleTheme, onHome, onCode }) {
  const entry = REGISTRY[slug];
  const [expanded, setExpanded] = useState(false);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!entry) return null;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      /* ignore */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="detail">
      <nav className="crumbs">
        <button type="button" className="brand" onClick={onHome}>
          <span className="brand-mark" aria-hidden="true" />
        </button>
        <button type="button" className="crumb" onClick={onHome}>
          Components
        </button>
        <span className="crumb-sep">/</span>
        <span className="crumb current">{entry.title}</span>
      </nav>

      <div className="detail-grid">
        <div className="detail-body">
          <div className="detail-title-row">
            <h1 className="detail-title">{entry.title}</h1>
            <span className="detail-date">{entry.date}</span>
          </div>

          <p className="detail-desc">{entry.description}</p>

          <div className="detail-icons">
            <button
              type="button"
              className="icon-btn plain"
              onClick={copyLink}
              aria-label="Copy link"
            >
              {copied ? <Check size={16} /> : <LinkIcon size={16} />}
            </button>
            <button
              type="button"
              className="icon-btn plain"
              onClick={() => setExpanded((v) => !v)}
              aria-label="Expand preview"
            >
              {expanded ? <Minimize2 size={16} /> : <ArrowUpRight size={16} />}
            </button>
          </div>

          <section className="detail-section">
            <h2>Installation</h2>
            <InstallBlock deps={entry.deps} />
          </section>

          <section className="detail-section">
            <h2>File Structure</h2>
            <FileTree files={entry.files} />
          </section>

          <button
            type="button"
            className="pill get-code"
            onClick={() => onCode(entry.id)}
          >
            <Code2 size={15} />
            Get the source
          </button>
        </div>

        <div className="detail-side">
          <div
            className={[
              "preview-frame",
              entry.controls === "card" ? "card-mode" : null,
              expanded ? "expanded" : null,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <Preview entry={entry} demo={demo} scale={54} />

            {open && (
              <SettingsPanel
                controls={entry.controls}
                value={demo.settings}
                onChange={demo.setSettings}
                onReset={demo.resetSettings}
              />
            )}

            <div className="preview-tools">
              <button
                type="button"
                className="tool"
                onClick={() => setExpanded((v) => !v)}
                aria-label="Expand"
              >
                {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
              <button
                type="button"
                className="tool"
                onClick={demo.replay}
                aria-label="Restart animation"
              >
                <RotateCcw size={16} />
              </button>
              <span className="tool-sep" />
              <button
                type="button"
                className="tool"
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <button
                type="button"
                className={open ? "tool on labelled" : "tool"}
                onClick={() => setOpen((v) => !v)}
                aria-label="Settings"
              >
                <SlidersHorizontal size={16} />
                <AnimatePresence>
                  {open && (
                    <motion.span
                      className="tool-label"
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: "auto", opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 420, damping: 30 }}
                    >
                      Settings
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
              <button
                type="button"
                className="tool accent"
                onClick={() => onCode(entry.id)}
                aria-label="View code"
              >
                <Code2 size={16} />
              </button>
            </div>
          </div>

          {entry.controls === "text" && (
            <div className="text-editor">
              <label className="text-editor-label" htmlFor="dia-text-input">
                Your text
              </label>
              <input
                id="dia-text-input"
                type="text"
                className="text-editor-input"
                value={demo.lines[0] || ""}
                placeholder="Type a line of your own…"
                autoComplete="off"
                spellCheck="false"
                maxLength={72}
                onChange={(e) => demo.setLines([e.target.value])}
              />

              <span className="text-editor-label">Color</span>
              <div
                className="palette-chips"
                role="group"
                aria-label="Gradient palette"
              >
                {PALETTE_OPTIONS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className={
                      demo.palette === p.id
                        ? "palette-chip active"
                        : "palette-chip"
                    }
                    onClick={() => {
                      demo.setPalette(p.id);
                      demo.replay();
                    }}
                  >
                    <span
                      className="palette-swatch"
                      style={{
                        background:
                          p.id === "custom"
                            ? `linear-gradient(90deg, ${demo.customColors.join(
                                ", "
                              )})`
                            : stopsToCss(PALETTES[p.id].stops),
                      }}
                    />
                    {p.label}
                  </button>
                ))}
              </div>

              {demo.palette === "custom" && (
                <div className="color-inputs">
                  {demo.customColors.map((c, i) => (
                    <label
                      className="color-input"
                      key={i}
                      title={`Color ${i + 1}`}
                    >
                      <input
                        type="color"
                        value={c}
                        onChange={(e) => {
                          const next = [...demo.customColors];
                          next[i] = e.target.value;
                          demo.setCustomColors(next);
                        }}
                      />
                    </label>
                  ))}
                  <button
                    type="button"
                    className="color-reset"
                    onClick={() => demo.setCustomColors(CUSTOM_PRESET)}
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
