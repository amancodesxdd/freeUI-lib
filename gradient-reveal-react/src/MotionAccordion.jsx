import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import "./styles/motion-faqs-accordion.css";

export const FAQ_ITEMS = [
  {
    question: "What is unlumen UI?",
    answer:
      "A collection of premium components built with Motion and Tailwind CSS.",
  },
  {
    question: "Do I need to install a package?",
    answer:
      "No — every component is delivered as source code via the registry.",
  },
  {
    question: "Can a visitor have several answers open?",
    answer:
      "No. Only one item can be open at a time, and clicking an open item collapses it.",
  },
];

const SPRING = { type: "spring", stiffness: 320, damping: 30, mass: 0.9 };

/** Panel that measures its own content so the spring targets exact pixels. */
function Panel({ open, reduced, spring, children }) {
  const ref = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setHeight(el.scrollHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <motion.div
      className="faq-panel"
      initial={false}
      animate={{ height: open ? height : 0, opacity: open ? 1 : 0 }}
      transition={reduced ? { duration: 0 } : spring}
      aria-hidden={!open}
    >
      <div className="faq-answer" ref={ref}>
        {children}
      </div>
    </motion.div>
  );
}

/**
 * A clean Motion-powered FAQ accordion with spring-animated content reveal.
 * Only one item is open at a time; clicking an open item collapses it.
 * Ported from the unlumen UI `MotionAccordion`.
 */
export function MotionAccordion({
  items = [],
  gap = 10,
  reduced = false,
  spring = SPRING,
  className = "",
}) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className={`faq ${className}`.trim()} style={{ gap }}>
      {items.map((item, i) => {
        const open = i === openIndex;
        return (
          <div className={`faq-item${open ? " open" : ""}`} key={i}>
            <button
              type="button"
              className="faq-trigger"
              aria-expanded={open}
              onClick={() => setOpenIndex(open ? -1 : i)}
            >
              <span className="faq-question">{item.question}</span>
              <motion.span
                className="faq-icon"
                animate={{ rotate: open ? 180 : 0 }}
                transition={reduced ? { duration: 0 } : spring}
              >
                <ChevronDown size={18} strokeWidth={2} />
              </motion.span>
            </button>

            <Panel open={open} reduced={reduced} spring={spring}>
              {item.answer}
            </Panel>
          </div>
        );
      })}
    </div>
  );
}

export default MotionAccordion;
