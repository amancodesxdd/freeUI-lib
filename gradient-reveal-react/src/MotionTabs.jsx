import { useState } from "react";
import { springFor } from "./motion-presets";
import "./styles/motion-tabs.css";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Bolt,
  BookOpen,
  ChevronRight,
  Clock,
  Folder,
  LogOut,
  Puzzle,
  Sparkles,
  TrendingUp,
  User,
} from "lucide-react";

/* ------------------------------------------------------------------ data */

const TABS = [
  { id: "focus", label: "Focus", Icon: Bolt },
  { id: "progression", label: "Progression", Icon: TrendingUp },
  { id: "ideas", label: "Ideas", Icon: Puzzle },
  { id: "activity", label: "Activity", Icon: Bell },
  { id: "profile", label: "Profile", Icon: User },
];

const IDEAS = [
  { title: "Adaptive color themes", body: "Generate palettes from a single brand hue…", tag: "Design" },
  { title: "Micro-interaction library", body: "Reusable spring animations for product…", tag: "Dev" },
  { title: "AI component naming", body: "Use LLM to suggest semantic component…", tag: "AI" },
  { title: "Dark mode token audit", body: "Review all CSS vars for contrast in both…", tag: "Design" },
  { title: "Gesture shortcuts", body: "Power users keep their hands on the keyboard…", tag: "Dev" },
];

const ACTIVITY = [
  { who: "Sarah", what: "commented on", subject: "Design system audit", tone: "violet", time: "3m ago" },
  { who: "Alex", what: "merged", subject: "feat/motion-tabs-menu", tone: "green", time: "18m ago" },
  { who: "You", what: "created", subject: "Registry search idea", tone: "blue", time: "1h ago" },
  { who: "Marc", what: "reviewed", subject: "Component usage heatmap", tone: "orange", time: "2h ago" },
  { who: "Sarah", what: "closed", subject: "Dark mode token audit", tone: "pink", time: "3h ago" },
];

const MENU = [
  { label: "Profile", Icon: User },
  { label: "Upgrade", Icon: Sparkles },
  { label: "Projects", Icon: Folder },
  { label: "Documentation", Icon: BookOpen },
  { label: "Logout", Icon: LogOut, danger: true },
];

const WEEK = [
  { d: "M", v: 0.9 },
  { d: "T", v: 0.64 },
  { d: "W", v: 0.42 },
  { d: "T", v: 1 },
  { d: "F", v: 0.3 },
  { d: "S", v: 0.12 },
  { d: "S", v: 0.02 },
];

/* ------------------------------------------------------------- tab panels */

function FocusPanel() {
  return (
    <div className="mt-panel">
      <div className="mt-kicker">
        <span className="mt-dot" style={{ background: "#ff2d20" }} />
        Current task
      </div>

      <h3 className="mt-display">Design system audit</h3>

      <div className="mt-progress">
        <div className="mt-track">
          <motion.div
            className="mt-fill"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 0.65 }}
            transition={{ type: "spring", stiffness: 90, damping: 18 }}
          />
        </div>
        <span className="mt-chip">65%</span>
      </div>

      <div className="mt-meta">
        <Clock size={15} strokeWidth={2} />
        2h 15m
      </div>
    </div>
  );
}

function ProgressionPanel() {
  return (
    <div className="mt-panel">
      <div className="mt-row">
        <span className="mt-kicker plain">This week</span>
        <span className="mt-green">12/15 tasks</span>
      </div>

      <div className="mt-chart">
        {WEEK.map((w, i) => (
          <div className="mt-col" key={i}>
            <motion.div
              className="mt-bar-fill"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: Math.max(w.v, 0.03) }}
              transition={{
                type: "spring",
                stiffness: 170,
                damping: 20,
                delay: 0.04 + i * 0.045,
              }}
            />
            <span className="mt-day">{w.d}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function IdeasPanel() {
  return (
    <div className="mt-panel mt-scroll">
      {IDEAS.map((idea, i) => (
        <motion.div
          className="mt-idea"
          key={idea.title}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 240,
            damping: 24,
            delay: 0.04 + i * 0.055,
          }}
        >
          <div className="mt-idea-head">
            <span className="mt-idea-title">{idea.title}</span>
            <span className="mt-tag">{idea.tag}</span>
          </div>
          <p className="mt-idea-body">{idea.body}</p>
        </motion.div>
      ))}
    </div>
  );
}

function ActivityPanel() {
  return (
    <div className="mt-panel mt-scroll">
      {ACTIVITY.map((a, i) => (
        <motion.div
          className="mt-event"
          key={i}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            type: "spring",
            stiffness: 280,
            damping: 24,
            delay: 0.04 + i * 0.05,
          }}
        >
          <span className="mt-rail">
            <span className="mt-dot" style={{ background: `var(--tone-${a.tone})` }} />
            {i < ACTIVITY.length - 1 && <span className="mt-line" />}
          </span>
          <p className="mt-event-text">
            <strong>{a.who}</strong> <span className="mt-muted">{a.what}</span>{" "}
            <strong>{a.subject}</strong>
          </p>
          <span className="mt-time">{a.time}</span>
        </motion.div>
      ))}
    </div>
  );
}

function ProfilePanel({ reduced }) {
  return (
    <div className="mt-panel">
      {MENU.map((row, i) => (
        <motion.button
          type="button"
          className={row.danger ? "mt-row-item danger" : "mt-row-item"}
          key={row.label}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            type: "spring",
            stiffness: 280,
            damping: 24,
            delay: 0.03 + i * 0.05,
          }}
          whileTap={{ scale: reduced ? 1 : 0.98 }}
        >
          <row.Icon size={18} strokeWidth={1.9} />
          <span>{row.label}</span>
          <ChevronRight size={17} strokeWidth={1.9} className="mt-chev" />
        </motion.button>
      ))}
    </div>
  );
}

const PANELS = {
  focus: FocusPanel,
  progression: ProgressionPanel,
  ideas: IdeasPanel,
  activity: ActivityPanel,
  profile: ProfilePanel,
};

/* ------------------------------------------------------------------- bar */

const TAP = { type: "spring", stiffness: 700, damping: 26, mass: 0.4 };

export default function MotionTabs({ initial = 0, reduced = false, settings }) {
  const SPRING = springFor(settings?.ease ?? "Ease Out", settings?.duration ?? 0.42);
  const [active, setActive] = useState(initial);
  const [dir, setDir] = useState(1);

  const select = (i) => {
    if (i === active) return;
    setDir(i > active ? 1 : -1);
    setActive(i);
  };

  const Panel = PANELS[TABS[active].id];

  return (
    <div className="mt-card">
      <div className="mt-viewport">
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={TABS[active].id}
            className="mt-view"
            custom={dir}
            initial={
              reduced
                ? { opacity: 1 }
                : { opacity: 0, x: dir * 46, filter: "blur(6px)" }
            }
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={
              reduced ? { opacity: 0 } : { opacity: 0, x: dir * -46, filter: "blur(6px)" }
            }
            transition={SPRING}
          >
            <Panel reduced={reduced} />
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.nav className={settings?.variant === 1 ? "mt-bar dense" : "mt-bar"} layout transition={SPRING}>
        {TABS.map((tab, i) => {
          const on = i === active;
          return (
            <motion.button
              key={tab.id}
              type="button"
              className={on ? "mt-tab on" : "mt-tab"}
              onClick={() => select(i)}
              whileTap={{ scale: reduced ? 1 : 0.85 }}
              transition={TAP}
              aria-pressed={on}
              aria-label={tab.label}
            >
              {on && <motion.span className="mt-pill" layoutId="mt-pill" transition={SPRING} />}
              <span className="mt-tab-inner">
                <tab.Icon size={17} strokeWidth={2.1} className="mt-tab-icon" />
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.span
                      className="mt-tab-label"
                      key="label"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={SPRING}
                    >
                      {tab.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            </motion.button>
          );
        })}
      </motion.nav>
    </div>
  );
}
