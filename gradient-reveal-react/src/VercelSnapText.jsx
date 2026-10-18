import { useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import "./styles/vercel-snap-text.css";

export const SNAP_ITEMS = ["the platform", "the brand", "the future"];

function Row({ item, index, progress, itemHeight, showNeighbors }) {
  const dist = useTransform(progress, (p) => Math.abs(p - index));
  const opacity = useTransform(dist, (d) => {
    if (!showNeighbors) return d < 0.5 ? 1 : 0;
    return Math.max(0.15, 1 - d * 0.82);
  });
  const scale = useTransform(dist, (d) =>
    Math.max(0.74, 1 - Math.min(d, 1) * 0.26)
  );
  const x = useTransform(dist, (d) => Math.min(d, 1) * 32);

  return (
    <div className="vst-row" style={{ height: itemHeight }}>
      <motion.span className="vst-label" style={{ opacity, scale, x }}>
        {item}
      </motion.span>
    </div>
  );
}

/**
 * A scroll-driven text list that snaps exactly to each item.
 * The active item scales up beside a static prefix; the others fade and
 * indent. Scrolling is handled by an invisible, scroll-snapped overlay while
 * a spring-animated track keeps the active row centred.
 */
export function VercelSnapText({
  items = [],
  prefix = "",
  itemHeight = 96,
  prefixGap = 12,
  showNeighbors = true,
  stiffness = 200,
  damping = 28,
  reduced = false,
  className = "",
}) {
  const stageRef = useRef(null);
  const scrollRef = useRef(null);
  const [sectionHeight, setSectionHeight] = useState(0);

  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => setSectionHeight(el.clientHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { scrollY } = useScroll({ container: scrollRef });
  const springed = useSpring(scrollY, { stiffness, damping, mass: 0.8 });
  const source = reduced ? scrollY : springed;

  const progress = useTransform(source, (v) =>
    sectionHeight ? v / sectionHeight : 0
  );

  const trackY = useTransform(progress, (p) => {
    if (!sectionHeight) return 0;
    return sectionHeight / 2 - (p * itemHeight + itemHeight / 2);
  });

  return (
    <div className={`vst ${className}`.trim()} style={{ gap: prefixGap }}>
      {prefix ? <span className="vst-prefix">{prefix}</span> : null}

      <div className="vst-stage" ref={stageRef}>
        <div className="vst-visual" aria-hidden="true">
          <motion.div className="vst-track" style={{ y: trackY }}>
            {items.map((item, i) => (
              <Row
                key={i}
                item={item}
                index={i}
                progress={progress}
                itemHeight={itemHeight}
                showNeighbors={showNeighbors}
              />
            ))}
          </motion.div>
        </div>

        <div className="vst-scroll" ref={scrollRef} tabIndex={0}>
          {items.map((item, i) => (
            <div
              className="vst-section"
              key={i}
              style={{ height: sectionHeight || "100%" }}
              aria-label={item}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default VercelSnapText;
