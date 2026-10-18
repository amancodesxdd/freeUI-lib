import { useEffect, useState } from "react";
import { LayoutGroup, motion } from "framer-motion";
import {
  BookOpen,
  Coffee,
  Dumbbell,
  Leaf,
  Music,
  Pin,
} from "lucide-react";
import { springFor } from "./motion-presets";
import "./styles/pinned-list.css";

const ITEMS = [
  {
    id: "cafe",
    name: "Café Lumière",
    meta: "Coffee Shop · Opens at 7:00 AM",
    Icon: Coffee,
  },
  {
    id: "volta",
    name: "Volta Bookstore",
    meta: "Books & Stationery · Closes at 7:00 PM",
    Icon: BookOpen,
  },
  {
    id: "pilates",
    name: "Pilates Studio",
    meta: "Wellness · Class at 8:30 AM",
    Icon: Dumbbell,
  },
  {
    id: "market",
    name: "Organic Market",
    meta: "Fresh Produce · Sat. & Sun. mornings",
    Icon: Leaf,
  },
  {
    id: "vinyl",
    name: "Vinyl & Co.",
    meta: "Record Shop · Closes at 8:00 PM",
    Icon: Music,
  },
];



function Row({ item, pinned, spring, onToggle }) {
  return (
    <motion.button
      layout
      layoutId={`row-${item.id}`}
      transition={spring}
      type="button"
      className={pinned ? "pl-row pinned" : "pl-row"}
      onClick={() => onToggle(item.id)}
      whileTap={{ scale: 0.985 }}
    >
      <span className="pl-icon">
        <item.Icon size={18} strokeWidth={1.8} />
      </span>

      <span className="pl-text">
        <span className="pl-title">{item.name}</span>
        <span className="pl-meta">{item.meta}</span>
      </span>

      <motion.span
        layout
        transition={spring}
        className="pl-pin"
        aria-hidden="true"
      >
        <Pin size={15} strokeWidth={2} />
      </motion.span>
    </motion.button>
  );
}

function Section({ label, items, pinned, onToggle, spring, collapse }) {
  const empty = items.length === 0;

  return (
    <motion.section
      className="pl-section"
      animate={{ height: collapse && empty ? 0 : "auto", opacity: empty ? 0 : 1 }}
      initial={false}
      transition={spring}
    >
      <div className="pl-inner">
        <span className="pl-label">{label}</span>
        <LayoutGroup id="pinned-list">
          {items.map((item) => (
            <Row
              key={item.id}
              item={item}
              pinned={pinned}
              spring={spring}
              onToggle={onToggle}
            />
          ))}
        </LayoutGroup>
      </div>
    </motion.section>
  );
}

export default function PinnedList({ autoPin = true, reduced = false, settings }) {
  const [pinnedIds, setPinnedIds] = useState([]);

  const spring = springFor(settings?.ease ?? "Ease Out", settings?.duration ?? 0.5);
  const pinnedLast = settings?.variant === 1;

  useEffect(() => {
    if (!autoPin || reduced) return;
    const t = setTimeout(() => setPinnedIds(["cafe"]), 1400);
    return () => clearTimeout(t);
  }, [autoPin, reduced]);

  const toggle = (id) =>
    setPinnedIds((ids) =>
      ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]
    );

  const pinned = ITEMS.filter((i) => pinnedIds.includes(i.id));
  const rest = ITEMS.filter((i) => !pinnedIds.includes(i.id));

  const pinnedSection = (
    <Section
      key="pinned"
      label="Pinned Items"
      items={pinned}
      pinned
      collapse
      onToggle={toggle}
      spring={spring}
    />
  );

  const allSection = (
    <Section
      key="all"
      label="All Items"
      items={rest}
      onToggle={toggle}
      spring={spring}
    />
  );

  return (
    <div className="pl">
      {pinnedLast ? (
        <>
          {allSection}
          {pinnedSection}
        </>
      ) : (
        <>
          {pinnedSection}
          {allSection}
        </>
      )}

      <p className="pl-hint">
        {reduced ? "Static preview" : "Tap a row to pin or unpin it"}
      </p>
    </div>
  );
}
