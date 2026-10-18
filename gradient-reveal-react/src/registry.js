export const REGISTRY = {
  "dia-text-reveal": {
    id: "dia-text-reveal",
    title: "Dia Text Reveal",
    kicker: "Typography",
    date: "March 11, 2026",
    description:
      "Animated text reveal with a colorful gradient sweep effect, inspired by the Dia app.",
    deps: "framer-motion",
    controls: "text",
    files: [
      { name: "your-project" },
      {
        name: "src",
        children: [
          {
            name: "components",
            children: [{ name: "GradientText.jsx" }],
          },
          {
            name: "styles",
            children: [
              { name: "gradient-text.css" },
              { name: "theme.css" },
            ],
          },
        ],
      },
      { name: "package.json" },
    ],
  },

  "floating-tab-bar": {
    id: "floating-tab-bar",
    title: "Floating Tab Bar",
    kicker: "Navigation",
    date: "April 2, 2026",
    description:
      "A floating bottom tab bar with animated width expansion, direction-aware content transitions and spring-driven tap feedback.",
    deps: "framer-motion lucide-react",
    controls: "tabs",
    files: [
      { name: "your-project" },
      {
        name: "src",
        children: [
          {
            name: "components",
            children: [{ name: "MotionTabs.jsx" }],
          },
          {
            name: "styles",
            children: [{ name: "motion-tabs.css" }, { name: "theme.css" }],
          },
        ],
      },
      { name: "package.json" },
    ],
  },

  "team-stack": {
    id: "team-stack",
    title: "Team Stack",
    kicker: "Marketing",
    date: "April 12, 2026",
    description:
      "A stacked deck of team member cards that fans out on hover (desktop) or tap (mobile), with spring-animated CTA pills and deterministic jitter for a natural pile feel.",
    deps: "framer-motion lucide-react",
    controls: "team",
    files: [
      { name: "your-project" },
      {
        name: "src",
        children: [
          {
            name: "components",
            children: [{ name: "TeamStack.jsx" }],
          },
          {
            name: "styles",
            children: [{ name: "team-stack.css" }, { name: "theme.css" }],
          },
        ],
      },
      { name: "package.json" },
    ],
  },

  "pinned-list": {
    id: "pinned-list",
    title: "Pinned List",
    kicker: "Layout",
    date: "March 11, 2026",
    description:
      "A list of items that animate smoothly to a pinned section using Framer Motion layout animations.",
    deps: "framer-motion lucide-react",
    controls: "pins",
    files: [
      { name: "your-project" },
      {
        name: "src",
        children: [
          {
            name: "components",
            children: [{ name: "PinnedList.jsx" }],
          },
          {
            name: "styles",
            children: [{ name: "pinned-list.css" }, { name: "theme.css" }],
          },
        ],
      },
      { name: "package.json" },
    ],
  },

  "animated-input": {
    id: "animated-input",
    title: "Animated Input",
    kicker: "Forms",
    date: "August 1, 2026",
    description:
      "A text input with per-character motion and a custom cursor that springs between typing and selection states.",
    deps: "framer-motion",
    controls: "input",
    files: [
      { name: "your-project" },
      {
        name: "src",
        children: [
          {
            name: "components",
            children: [{ name: "AnimatedInput.jsx" }],
          },
          {
            name: "styles",
            children: [{ name: "animated-input.css" }, { name: "theme.css" }],
          },
        ],
      },
      { name: "package.json" },
    ],
  },

  "animate-count": {
    id: "animate-count",
    title: "Animate Count",
    kicker: "Motion",
    date: "March 12, 2026",
    description:
      "A number display that animates transitions between values with a blur + slide effect.",
    deps: "framer-motion",
    controls: "count",
    files: [
      { name: "your-project" },
      {
        name: "src",
        children: [
          {
            name: "components",
            children: [{ name: "AnimateCount.jsx" }],
          },
          {
            name: "styles",
            children: [{ name: "animate-count.css" }, { name: "theme.css" }],
          },
        ],
      },
      { name: "package.json" },
    ],
  },

  "motion-faqs-accordion": {
    id: "motion-faqs-accordion",
    title: "Motion FAQs Accordion",
    kicker: "Content",
    date: "March 8, 2026",
    description:
      "A clean Motion-powered FAQ accordion with spring-animated content reveal and ResizeObserver-measured panel heights.",
    deps: "framer-motion lucide-react",
    controls: "faq",
    files: [
      { name: "your-project" },
      {
        name: "src",
        children: [
          {
            name: "components",
            children: [{ name: "MotionAccordion.jsx" }],
          },
          {
            name: "styles",
            children: [
              { name: "motion-faqs-accordion.css" },
              { name: "theme.css" },
            ],
          },
        ],
      },
      { name: "package.json" },
    ],
  },

  "vercel-snap-text": {
    id: "vercel-snap-text",
    title: "Vercel Snap Text",
    kicker: "Scrolling",
    date: "March 8, 2026",
    description:
      "A scroll-driven text list that snaps exactly to each item, with a spring-animated track that scales, fades and indents the rows.",
    deps: "framer-motion",
    controls: "snap",
    files: [
      { name: "your-project" },
      {
        name: "src",
        children: [
          {
            name: "components",
            children: [{ name: "VercelSnapText.jsx" }],
          },
          {
            name: "styles",
            children: [
              { name: "vercel-snap-text.css" },
              { name: "theme.css" },
            ],
          },
        ],
      },
      { name: "package.json" },
    ],
  },

  matrix: {
    id: "matrix",
    title: "Matrix",
    kicker: "Display",
    date: "March 12, 2026",
    description:
      "An LED dot matrix display with SVG pixels, radial glow, animated presets (digits, loader, wave, snake) and a VU-meter mode.",
    deps: "",
    controls: "matrix",
    files: [
      { name: "your-project" },
      {
        name: "src",
        children: [
          { name: "components", children: [{ name: "Matrix.jsx" }] },
          {
            name: "styles",
            children: [{ name: "matrix.css" }, { name: "theme.css" }],
          },
        ],
      },
      { name: "package.json" },
    ],
  },

  "tilt-card": {
    id: "tilt-card",
    title: "Tilt Card",
    kicker: "Marketing",
    date: "March 8, 2026",
    description:
      "A card with 3D spring tilt, an optional floating image, a split badge pill and a cursor-following radial shine on hover.",
    deps: "framer-motion",
    controls: "card",
    files: [
      { name: "your-project" },
      {
        name: "src",
        children: [
          {
            name: "components",
            children: [
              { name: "TiltCard.jsx" },
              { name: "Tilt.jsx" },
              { name: "ClippedCircle.jsx" },
            ],
          },
          {
            name: "styles",
            children: [
              { name: "tilt-card.css" },
              { name: "clipped-circle.css" },
              { name: "theme.css" },
            ],
          },
        ],
      },
      { name: "package.json" },
    ],
  },
};

export const COMPONENT_LIST = [
  REGISTRY["dia-text-reveal"],
  REGISTRY["floating-tab-bar"],
  REGISTRY["team-stack"],
  REGISTRY["pinned-list"],
  REGISTRY["animated-input"],
  REGISTRY["tilt-card"],
  REGISTRY["animate-count"],
  REGISTRY["motion-faqs-accordion"],
  REGISTRY["vercel-snap-text"],
  REGISTRY["matrix"],
].map((c) => ({ tier: "free", ...c }));

export const PM = ["npm", "pnpm", "yarn", "bun"];

export function installCommand(pm, deps) {
  return deps ? `${pm} i ${deps}` : `${pm} install`;
}
