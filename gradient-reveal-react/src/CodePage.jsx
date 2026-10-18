import { useMemo, useState } from "react";
import { Check, Copy, Download, Layers } from "lucide-react";
import { REGISTRY } from "./registry";
import gradientSrc from "./GradientText.jsx?raw";
import tabsSrc from "./MotionTabs.jsx?raw";
import teamSrc from "./TeamStack.jsx?raw";
import pinsSrc from "./PinnedList.jsx?raw";
import inputSrc from "./AnimatedInput.jsx?raw";
import tiltCardSrc from "./TiltCard.jsx?raw";
import tiltSrc from "./Tilt.jsx?raw";
import clippedCircleSrc from "./ClippedCircle.jsx?raw";
import countSrc from "./AnimateCount.jsx?raw";
import faqSrc from "./MotionAccordion.jsx?raw";
import snapSrc from "./VercelSnapText.jsx?raw";
import matrixSrc from "./Matrix.jsx?raw";
import palettesSrc from "./palettes.js?raw";
import presetsSrc from "./motion-presets.js?raw";
import gradientCss from "./styles/gradient-text.css?raw";
import tabsCss from "./styles/motion-tabs.css?raw";
import teamCss from "./styles/team-stack.css?raw";
import pinsCss from "./styles/pinned-list.css?raw";
import inputCss from "./styles/animated-input.css?raw";
import tiltCss from "./styles/tilt-card.css?raw";
import clippedCss from "./styles/clipped-circle.css?raw";
import countCss from "./styles/animate-count.css?raw";
import faqCss from "./styles/motion-faqs-accordion.css?raw";
import snapCss from "./styles/vercel-snap-text.css?raw";
import matrixCss from "./styles/matrix.css?raw";
import themeSrc from "./styles/theme.css?raw";

const USAGE = {
  gradient: `import GradientText from "./GradientText";
import { PALETTES } from "./palettes";

export default function Hero() {
  return (
    <GradientText
      text="Never stop iterating."
      mode="typewriter"   // "typewriter" | "sweep" | "pop"
      stops={PALETTES.dia.stops}
      shine
    />
  );
}`,

  tabs: `import MotionTabs from "./MotionTabs";

export default function Screen() {
  return <MotionTabs settings={{ ease: "Ease Out", duration: 0.42 }} />;
}`,

  team: `import TeamStack from "./TeamStack";

export default function About() {
  return <TeamStack />;
}`,

  pins: `import PinnedList from "./PinnedList";

export default function Places() {
  return <PinnedList placeholder="" />;
}`,

  input: `import AnimatedInput from "./AnimatedInput";

export default function Field() {
  return (
    <AnimatedInput
      placeholder="Type something…"
      cursorVariant="glow"      // "line" | "block" | "underline" | "glow"
      charAnimation="spring"    // spring | bounce | fade | slide | wave | typewriter
      inputVariant="underline"  // default | ghost | outline | filled | terminal | minimal | pill
      onChange={(value) => console.log(value)}
    />
  );
}`,

  card: `import TiltCard from "./TiltCard";

export default function Templates() {
  return (
    <TiltCard
      title="Starter Kit"
      description="Everything you need to ship fast."
      price="Free"
      badgeLabel="Popular"
      badgeVariant="success"  // "success" | "warning"
      imageSrc="/preview.png"
      href="/templates/starter"
    >
      <ul>
        <li>✓ Unlimited projects</li>
        <li>✓ Priority support</li>
      </ul>
    </TiltCard>
  );
}`,

  count: `import { AnimateCount } from "./AnimateCount";

export default function Stat({ count }) {
  return <AnimateCount>{count}</AnimateCount>;
}`,

  faq: `import { MotionAccordion } from "./MotionAccordion";

const items = [
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
];

export default function FAQs() {
  return <MotionAccordion items={items} gap={10} />;
}`,

  snap: `import { VercelSnapText } from "./VercelSnapText";

export default function Hero() {
  return (
    <VercelSnapText
      items={["the platform", "the brand", "the future"]}
      prefix="We Design"
      className="h-screen"
    />
  );
}`,

  matrix: `import { Matrix, digits, loader, vu } from "./Matrix";

// Static pattern — render digit "7"
<Matrix rows={7} cols={5} pattern={digits[7]} size={12} gap={3} />

// Animated preset
<Matrix rows={7} cols={7} frames={loader} fps={12} size={12} gap={3} />

// VU meter mode
<Matrix
  rows={7}
  cols={8}
  mode="vu"
  levels={[0.9, 0.6, 0.8, 0.4, 0.7, 0.5, 0.8, 0.3]}
  size={12}
  gap={3}
/>`,
};

const GROUPS = [
  {
    id: "gradient",
    label: "Dia Text Reveal",
    component: "dia-text-reveal",
    files: [
      { name: "GradientText.jsx", src: gradientSrc },
      { name: "gradient-text.css", src: gradientCss },
      { name: "Usage", src: USAGE.gradient, lang: "jsx" },
    ],
  },
  {
    id: "tabs",
    label: "Floating Tab Bar",
    component: "floating-tab-bar",
    files: [
      { name: "MotionTabs.jsx", src: tabsSrc },
      { name: "motion-tabs.css", src: tabsCss },
      { name: "Usage", src: USAGE.tabs, lang: "jsx" },
    ],
  },
  {
    id: "team",
    label: "Team Stack",
    component: "team-stack",
    files: [
      { name: "TeamStack.jsx", src: teamSrc },
      { name: "team-stack.css", src: teamCss },
      { name: "Usage", src: USAGE.team, lang: "jsx" },
    ],
  },
  {
    id: "pins",
    label: "Pinned List",
    component: "pinned-list",
    files: [
      { name: "PinnedList.jsx", src: pinsSrc },
      { name: "pinned-list.css", src: pinsCss },
      { name: "Usage", src: USAGE.pins, lang: "jsx" },
    ],
  },
  {
    id: "input",
    label: "Animated Input",
    component: "animated-input",
    files: [
      { name: "AnimatedInput.jsx", src: inputSrc },
      { name: "animated-input.css", src: inputCss },
      { name: "Usage", src: USAGE.input, lang: "jsx" },
    ],
  },
  {
    id: "card",
    label: "Tilt Card",
    component: "tilt-card",
    files: [
      { name: "TiltCard.jsx", src: tiltCardSrc },
      { name: "Tilt.jsx", src: tiltSrc },
      { name: "ClippedCircle.jsx", src: clippedCircleSrc },
      { name: "tilt-card.css", src: tiltCss },
      { name: "clipped-circle.css", src: clippedCss },
      { name: "Usage", src: USAGE.card, lang: "jsx" },
    ],
  },
  {
    id: "matrix",
    label: "Matrix",
    component: "matrix",
    files: [
      { name: "Matrix.jsx", src: matrixSrc },
      { name: "matrix.css", src: matrixCss },
      { name: "Usage", src: USAGE.matrix, lang: "jsx" },
    ],
  },
  {
    id: "snap",
    label: "Vercel Snap Text",
    component: "vercel-snap-text",
    files: [
      { name: "VercelSnapText.jsx", src: snapSrc },
      { name: "vercel-snap-text.css", src: snapCss },
      { name: "Usage", src: USAGE.snap, lang: "jsx" },
    ],
  },
  {
    id: "faq",
    label: "Motion FAQs Accordion",
    component: "motion-faqs-accordion",
    files: [
      { name: "MotionAccordion.jsx", src: faqSrc },
      { name: "motion-faqs-accordion.css", src: faqCss },
      { name: "Usage", src: USAGE.faq, lang: "jsx" },
    ],
  },
  {
    id: "shared",
    label: "Shared",
    files: [
      { name: "theme.css", src: themeSrc },
      { name: "motion-presets.js", src: presetsSrc },
      { name: "palettes.js", src: palettesSrc },
    ],
  },
];

const DEFAULT_DEPS = "framer-motion lucide-react";

const TOKEN_RE =
  /(\/\/[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\b(?:import|export|from|default|const|let|var|function|return|if|else|new|class|extends|await|async|true|false|null|undefined)\b)|([A-Z][A-Za-z0-9_$]*)|\b(\d+(?:\.\d+)?)\b/g;

const CLASSES = ["t-com", "t-str", "t-kw", "t-comp", "t-num"];

function highlight(code) {
  const out = [];
  let last = 0;
  TOKEN_RE.lastIndex = 0;
  let m;
  while ((m = TOKEN_RE.exec(code))) {
    if (m.index > last) out.push(code.slice(last, m.index));
    const gi = m.findIndex((g, k) => k > 0 && g !== undefined);
    out.push(gi === -1 ? m[0] : { text: m[0], cls: CLASSES[gi - 1] });
    last = m.index + m[0].length;
  }
  if (last < code.length) out.push(code.slice(last));
  return out.map((t, k) =>
    typeof t === "string" ? (
      t
    ) : (
      <span className={t.cls} key={k}>
        {t.text}
      </span>
    )
  );
}

async function writeClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
    return true;
  }
}

function download(text, filename) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function useCopy() {
  const [copied, setCopied] = useState(null);
  const copy = async (text, key) => {
    await writeClipboard(text);
    setCopied(key);
    setTimeout(() => setCopied((c) => (c === key ? null : c)), 1600);
  };
  return [copied, copy];
}

const bundle = (files) =>
  files
    .map((f) => `/* ===== ${f.name} ===== */\n\n${f.src}`)
    .join("\n\n");

export default function CodePage({ slug }) {
  const shown = useMemo(() => {
    const filtered = slug ? GROUPS.filter((g) => g.component === slug) : GROUPS;
    return filtered.length ? filtered : GROUPS;
  }, [slug]);

  const install = `npm i ${(slug && REGISTRY[slug]?.deps) || DEFAULT_DEPS}`;
  const fileCount = shown.reduce((n, g) => n + g.files.length, 0);

  const [active, setActive] = useState(
    () => `${shown[0].id}::${shown[0].files[0].name}`
  );
  const [copied, copy] = useCopy();

  const key = useMemo(() => {
    const [groupId, fileName] = active.split("::");
    const group = shown.find((g) => g.id === groupId);
    return group ? { group, file: group.files.find((f) => f.name === fileName) } : {};
  }, [active, shown]);

  const tokens = useMemo(
    () => (key.file ? highlight(key.file.src) : []),
    [key.file]
  );
  const lines = useMemo(
    () => (key.file ? key.file.src.split("\n").length : 0),
    [key.file]
  );

  return (
    <div className="code-page">
      <div className="install">
        <span className="prompt">$</span>
        <code>{install}</code>
        <button
          type="button"
          className="pill"
          onClick={() => copy(install, "install")}
        >
          {copied === "install" ? <Check size={15} /> : <Copy size={15} />}
        </button>
      </div>

      <div className="code-card">
        <aside className="file-list">
          <span className="label">Files</span>

          {shown.map((group) => (
            <div className="file-group" key={group.id}>
              <div className="file-group-head">
                <span>{group.label}</span>
                <button
                  type="button"
                  className="file-copy"
                  title={`Copy ${group.label} files`}
                  onClick={() => copy(bundle(group.files), `${group.id}-all`)}
                >
                  {copied === `${group.id}-all` ? (
                    <Check size={12} />
                  ) : (
                    <Layers size={12} />
                  )}
                </button>
              </div>

              {group.files.map((file) => {
                const id = `${group.id}::${file.name}`;
                return (
                  <button
                    key={id}
                    type="button"
                    className={active === id ? "file active" : "file"}
                    onClick={() => setActive(id)}
                  >
                    <span className="file-name">{file.name}</span>
                    <span className="file-meta">
                      {file.src.split("\n").length} lines
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </aside>

        <div className="code-main">
          <div className="code-bar">
            <div className="code-file">
              {key.group?.label}
              <span className="file-meta"> / {key.file?.name}</span>
            </div>

            {key.file && (
              <div className="code-actions">
                <button
                  type="button"
                  className="pill"
                  onClick={() => copy(key.file.src, active)}
                >
                  {copied === active ? "Copied" : "Copy"}
                </button>
                <button
                  type="button"
                  className="pill"
                  onClick={() => download(key.file.src, key.file.name)}
                >
                  <Download size={13} />
                </button>
              </div>
            )}
          </div>

          <pre className="code tall">
            <code>{tokens}</code>
          </pre>
        </div>
      </div>

      <p className="code-foot">
        {fileCount} real files{slug ? "" : ` across ${shown.length} groups`} ·
        each component ships its own CSS and only needs framer-motion +
        lucide-react. Copy the files and import <code>theme.css</code> once.
      </p>
    </div>
  );
}