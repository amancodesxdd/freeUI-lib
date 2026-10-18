import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./styles/animate-count.css";

const DEFAULT_EASE = [0.33, 1, 0.68, 1];

/**
 * A number display that animates transitions between values with a blur +
 * slide effect. The direction is inferred from whether the value went up or
 * down. Ported from the unlumen UI `AnimateCount` (concept by Rauno).
 */
export function AnimateCount({
  children,
  animate = true,
  duration = 0.42,
  ease = DEFAULT_EASE,
  className = "",
}) {
  const value = Number(children) || 0;
  const prev = useRef(value);
  const dir = value >= prev.current ? 1 : -1;

  useEffect(() => {
    prev.current = value;
  }, [value]);

  const text = value.toLocaleString("en-US");

  if (!animate) {
    return <span className={`ac ${className}`.trim()}>{text}</span>;
  }

  return (
    <span className={`ac ${className}`.trim()}>
      <AnimatePresence mode="popLayout" initial={false} custom={dir}>
        <motion.span
          key={text}
          className="ac-num"
          custom={dir}
          variants={{
            enter: (d) => ({ y: `${d * 105}%`, opacity: 0, filter: "blur(12px)" }),
            center: { y: "0%", opacity: 1, filter: "blur(0px)" },
            exit: { y: "0%", opacity: 0, filter: "blur(12px)" },
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration, ease }}
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default AnimateCount;

/**
 * Demo: a live counter that ticks on its own, with manual − / + controls.
 */
export function AnimateCountDemo({
  animate = true,
  duration = 0.42,
  ease = DEFAULT_EASE,
  start = 0,
  step = 1,
}) {
  const [n, setN] = useState(start);
  const [auto, setAuto] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setAuto((v) => v + step), 1600);
    return () => clearInterval(t);
  }, [step]);

  return (
    <div className="ac-demo">
      <div className="ac-block">
        <div className="ac-value">
          <AnimateCount animate={animate} duration={duration} ease={ease}>
            {n}
          </AnimateCount>
        </div>

        <div className="ac-controls">
          <button
            type="button"
            className="ac-btn"
            onClick={() => setN((v) => v - step)}
            aria-label="Decrease"
          >
            −
          </button>
          <button
            type="button"
            className="ac-btn"
            onClick={() => setN((v) => v + step)}
            aria-label="Increase"
          >
            +
          </button>
          <button
            type="button"
            className="ac-btn wide"
            onClick={() => setN((v) => v + 1000)}
          >
            +1,000
          </button>
        </div>
      </div>

      <div className="ac-auto">
        <span className="ac-tag">Auto</span>
        <span className="ac-value sm">
          <AnimateCount animate={animate} duration={duration} ease={ease}>
            {auto}
          </AnimateCount>
        </span>
      </div>
    </div>
  );
}
