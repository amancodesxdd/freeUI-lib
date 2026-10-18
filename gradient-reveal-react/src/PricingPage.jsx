import { motion } from "framer-motion";
import {
  Bookmark,
  Box,
  Boxes,
  BookOpen,
  HeartHandshake,
  Layers,
  LifeBuoy,
  Lightbulb,
  MessagesSquare,
  Sparkles,
  Users,
} from "lucide-react";

const FREE_FEATURES = [
  { Icon: Box, text: "Copy, paste, ship instantly" },
  { Icon: BookOpen, text: "Learn from real, production-ready code" },
  { Icon: Lightbulb, text: "Build standout UI without starting from scratch" },
  { Icon: Boxes, text: "All current and future components" },
  { Icon: Bookmark, text: "Use in unlimited projects" },
  { Icon: HeartHandshake, text: "Direct support from the maker" },
];

const STUDIO_FEATURES = [
  { Icon: Layers, text: "Everything in Free" },
  { Icon: Users, text: "For teams and studios" },
  { Icon: LifeBuoy, text: "Priority support" },
  { Icon: Sparkles, text: "Early access to new drops" },
  { Icon: MessagesSquare, text: "Custom requests" },
  { Icon: HeartHandshake, text: "Say thanks, if you like it" },
];

const fade = {
  hidden: { opacity: 0, y: 18 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 220, damping: 26, delay: 0.06 + i * 0.08 },
  }),
};

export default function PricingPage() {
  return (
    <div className="pricing">
      <div className="main-head">
        <div>
          <h1>Pricing</h1>
          <p>Everything here is free. There is nothing to buy and nothing to unlock.</p>
        </div>
      </div>

      <div className="pricing-grid">
        <motion.article
          className="plan plan-free"
          custom={0}
          variants={fade}
          initial="hidden"
          animate="show"
        >
          <span className="plan-glow" aria-hidden="true" />

          <div className="plan-head">
            <h2>Free</h2>
          </div>

          <div className="plan-price">
            <span className="amount">$0</span>
          </div>
          <div className="plan-sub">
            <span>Free forever</span>
            <span>Lifetime access</span>
          </div>

          <ul className="plan-list">
            {FREE_FEATURES.map(({ Icon, text }) => (
              <li key={text}>
                <Icon size={17} strokeWidth={1.8} />
                {text}
              </li>
            ))}
          </ul>

          <button type="button" className="plan-cta solid">
            Start building
          </button>
        </motion.article>

        <motion.article
          className="plan"
          custom={1}
          variants={fade}
          initial="hidden"
          animate="show"
        >
          <div className="plan-head">
            <h2>Studio</h2>
            <span className="plan-aside">Buying for a team?</span>
          </div>

          <div className="plan-price word">Spread love</div>
          <div className="plan-sub">
            <span>No seats to buy</span>
            <span>One payment</span>
          </div>

          <ul className="plan-list muted">
            {STUDIO_FEATURES.map(({ Icon, text }) => (
              <li key={text}>
                <Icon size={17} strokeWidth={1.8} />
                {text}
              </li>
            ))}
          </ul>

          <button type="button" className="plan-cta">Say thanks</button>
        </motion.article>
      </div>

      <div className="pricing-foot">
        <p>
          Are you a student? <span className="hot">Nothing to discount.</span>
        </p>
        <p>
          Prefer a lower upfront price?{" "}
          <span className="hot">Spread love whenever.</span>
        </p>
      </div>
    </div>
  );
}