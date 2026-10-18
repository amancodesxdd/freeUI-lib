import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { springFor } from "./motion-presets";
import "./styles/team-stack.css";

/* deterministic pseudo-random in [0,1) — same result on every render */
const rand = (seed) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const spread = (seed, amount) => (rand(seed) * 2 - 1) * amount;

const TEAM = [
  {
    name: "Alex Rivera",
    role: "Founder & CEO",
    bio: "Obsessed with craft and product quality. Alex shapes the vision and makes sure everything ships with intent.",
  },
  {
    name: "Mia Chen",
    role: "Head of Design",
    bio: "Mia turns complex problems into intuitive interfaces where every pixel has a reason.",
  },
  {
    name: "Jordan Osei",
    role: "Lead Engineer",
    bio: "Jordan architects systems that stay calm under load and sharp on delivery.",
  },
  {
    name: "Sara Novak",
    role: "Growth",
    bio: "Data-driven and creative in equal measure. Sara finds the levers that move the needle.",
  },
  {
    name: "Dani Fischer",
    role: "Operations",
    bio: "Dani keeps the humans running smoothly so everyone else can focus.",
  },
];

/* --------------------------------------------------------------- avatar */

function Face({ seed }) {
  const hair = Math.floor(rand(seed) * 3);
  const glasses = rand(seed + 31) > 0.55;
  const brow = rand(seed + 53) > 0.5;

  return (
    <svg viewBox="0 0 100 100" className="face" aria-hidden="true">
      <path
        d="M16 100c0-19 15-28 34-28s34 9 34 28H16Z"
        fill="currentColor"
        opacity="0.18"
      />
      <ellipse
        cx="50"
        cy="47"
        rx="19"
        ry="22"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.4"
      />

      {hair === 0 && (
        <path
          d="M30 42c-1-19 9-27 20-27s21 8 20 27c-3-9-9-13-20-13s-17 4-20 13Z"
          fill="currentColor"
        />
      )}
      {hair === 1 && (
        <path
          d="M29 44c-2-21 9-29 21-29s23 8 21 29c-2-6-4-9-7-11-5 6-23 6-28 0-3 2-5 5-7 11Z"
          fill="currentColor"
        />
      )}
      {hair === 2 && (
        <>
          <circle cx="50" cy="17" r="8" fill="currentColor" />
          <path
            d="M30 43c-2-20 8-27 20-27s22 7 20 27c-4-10-10-13-20-13s-16 3-20 13Z"
            fill="currentColor"
          />
        </>
      )}

      {brow && (
        <path
          d="M39 43c3-2 7-2 10 0M51 43c3-2 7-2 10 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
      )}

      <circle cx="43" cy="49" r="2.6" fill="currentColor" />
      <circle cx="57" cy="49" r="2.6" fill="currentColor" />

      {glasses ? (
        <>
          <circle
            cx="43"
            cy="49"
            r="7"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
          />
          <circle
            cx="57"
            cy="49"
            r="7"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
          />
          <path
            d="M50 49h0"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </>
      ) : (
        <path
          d="M46 59c2 2 6 2 8 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

/* ---------------------------------------------------------------- card */




function MemberCard({ member, index, count, expanded, active, fan, spring, onHover, onFocus }) {
  const i = index;
  const d = i - (count - 1) / 2;

  // deterministic jitter keeps the pile looking hand-thrown, never random per render
  const jx = spread(i + 3, 9);
  const jy = spread(i + 11, 7);
  const jr = spread(i + 19, 2.6);

  const pile = {
    x: d * 3 + jx * 0.5,
    y: jy * 0.5,
    rotate: d * 1.4 + jr * 0.6,
    scale: 1 - Math.abs(d) * 0.018,
  };

  const spreadPos = {
    x: d * fan.dx + jx,
    y: Math.abs(d) * 7 + jy,
    rotate: d * fan.rot + jr,
    scale: active ? 1 : 0.93,
  };

  const target = expanded ? spreadPos : pile;
  const dim = expanded && !active;

  return (
    <motion.article
      className={dim ? "ts-card dim" : "ts-card"}
      style={{ zIndex: active ? count + 1 : count - i }}
      animate={target}
      transition={spring}
      onPointerEnter={() => onHover(i)}
      onFocus={() => onFocus(i)}
      tabIndex={0}
      aria-label={`${member.name}, ${member.role}`}
    >
      <div className="ts-avatar">
        <Face seed={i + 1} />
      </div>

      <span className="ts-role">{member.role}</span>
      <h3 className="ts-name">{member.name}</h3>
      <p className="ts-bio">{member.bio}</p>

      <motion.div
        className="ts-action"
        animate={{ opacity: active || !expanded ? 1 : 0 }}
        transition={{ duration: 0.18 }}
      >
        {active && expanded ? (
          <motion.span
            className="ts-pill"
            initial={{ width: 34, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            transition={springFor("Ease Out", 0.34)}
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.05 }}
            >
              View work
            </motion.span>
            <ArrowUpRight size={15} strokeWidth={2.2} />
          </motion.span>
        ) : (
          <motion.span className="ts-round" layout transition={springFor("Ease Out", 0.34)}>
            <ArrowUpRight size={15} strokeWidth={2.2} />
          </motion.span>
        )}
      </motion.div>
    </motion.article>
  );
}

export default function TeamStack({ reduced = false, settings }) {
  const [expanded, setExpanded] = useState(false);
  const [active, setActive] = useState(0);

  const spring = springFor(settings?.ease ?? "Ease Out", settings?.duration ?? 0.6);
  const fan = settings?.variant === 1 ? { dx: 94, rot: 6 } : { dx: 116, rot: 9 };

  const collapse = () => {
    setExpanded(false);
    setActive(0);
  };

  return (
    <div
      className="ts-deck"
      onPointerEnter={() => setExpanded(true)}
      onPointerLeave={collapse}
    >
      <div className="ts-stage">
        {TEAM.map((member, i) => (
          <MemberCard
            key={member.name}
            member={member}
            index={i}
            count={TEAM.length}
            expanded={expanded}
            active={active === i}
            fan={fan}
            spring={spring}
            onHover={setActive}
            onFocus={(idx) => {
              setActive(idx);
              setExpanded(true);
            }}
          />
        ))}
      </div>

      <p className="ts-hint">
        {reduced ? "Static preview" : "Hover or tap to fan out the deck"}
      </p>
    </div>
  );
}
