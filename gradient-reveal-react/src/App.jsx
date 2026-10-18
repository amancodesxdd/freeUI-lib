import { useCallback, useEffect, useMemo, useState } from "react";
import Home from "./Home";
import CodePage from "./CodePage";
import ComponentPage from "./ComponentPage";
import PricingPage from "./PricingPage";
import Sidebar from "./Sidebar";
import {
  PALETTES,
  CUSTOM_PRESET,
  hexToRgb,
  makeCustomStops,
  withInk,
} from "./palettes";
import { REGISTRY } from "./registry";
import { DEFAULT_SETTINGS } from "./motion-presets";

const SAMPLES = ["Never stop iterating."];
const STORE_TEXT = "gr.text";
const STORE_THEME = "gr.theme.v2";
const STORE_SETTINGS = "gr.settings";
const STORE_COLORS = "gr.colors";


const THEMES = {
  light: { ink: "#1b1b1f", shine: "#ffffff" },
  dark: { ink: "#f2f1ee", shine: "#ffffff" },
};

function load(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : v;
  } catch {
    return fallback;
  }
}

function loadObject(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key) ?? "null");
    return v && typeof v === "object" ? v : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}


function routeFromHash() {
  const clean = window.location.hash
    .replace(/^#\/?/, "")
    .replace(/\/+$/, "");
  const [head, slug] = clean.split("/");
  if (head === "components" && slug && REGISTRY[slug]) {
    return { page: "component", slug };
  }
  if (head === "code") {
    return { page: "code", slug: slug && REGISTRY[slug] ? slug : null };
  }
  if (head === "pricing") return { page: "pricing", slug: null };
  return { page: "components", slug: null };
}

export default function App() {
  const [route, setRoute] = useState(routeFromHash);

  const [mode, setMode] = useState("typewriter");
  const [palette, setPalette] = useState("dia");
  const [customColors, setCustomColors] = useState(() =>
    loadObject(STORE_COLORS, CUSTOM_PRESET)
  );
  const [shine, setShine] = useState(true);
  const [runKey, setRunKey] = useState(0);
  const [lines, setLines] = useState(() => load(STORE_TEXT, SAMPLES[0]).split("\n"));
  const [theme, setTheme] = useState(() => load(STORE_THEME, "dark"));
  const [settings, setSettings] = useState(() => ({
    ...DEFAULT_SETTINGS,
    ...loadObject(STORE_SETTINGS, {}),
  }));

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    save(STORE_SETTINGS, {});
    setRunKey((k) => k + 1);
  }, []);

  const reduced = useMemo(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const stops = useMemo(() => {
    const base =
      palette === "custom"
        ? makeCustomStops(customColors)
        : PALETTES[palette].stops;
    return withInk(base, THEMES[theme].ink);
  }, [palette, customColors, theme]);
  const shineColor = useMemo(() => hexToRgb(THEMES[theme].shine), [theme]);

  const replay = useCallback(() => setRunKey((k) => k + 1), []);
  const stop = useCallback((e) => e.stopPropagation(), []);
  const go = useCallback((id) => {
    window.location.hash = `#/${id}`;
  }, []);

  useEffect(() => {
    const onHash = () => setRoute(routeFromHash());
    window.addEventListener("hashchange", onHash);
    if (!window.location.hash) window.location.replace("#/components");
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    save(STORE_THEME, theme);
  }, [theme]);

  useEffect(() => {
    save(STORE_TEXT, lines.join("\n"));
  }, [lines]);

  useEffect(() => {
    save(STORE_SETTINGS, settings);
  }, [settings]);

  useEffect(() => {
    save(STORE_COLORS, JSON.stringify(customColors));
  }, [customColors]);

  useEffect(() => {
    const onKey = (e) => {
      const t = e.target;
      if (t && (t.tagName === "TEXTAREA" || t.tagName === "INPUT")) {
        if (e.code === "Escape") t.blur();
        return;
      }
      if (e.code === "KeyT") setTheme((v) => (v === "light" ? "dark" : "light"));
      if (route.page === "components" && (e.code === "Space" || e.code === "Enter")) {
        e.preventDefault();
        replay();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [replay, route]);

  const demo = {
    mode,
    setMode,
    palette,
    setPalette,
    customColors,
    setCustomColors,
    shine,
    setShine,
    runKey,
    replay,
    lines,
    setLines,
    stops,
    shineColor,
    reduced,
    stop,
    go,
    settings,
    setSettings,
    resetSettings,
  };

  const toggleTheme = useCallback(
    () => setTheme((v) => (v === "light" ? "dark" : "light")),
    []
  );

  const codeEntry =
    route.page === "code" && route.slug ? REGISTRY[route.slug] : null;

  if (route.page === "component") {
    return (
      <ComponentPage
        slug={route.slug}
        demo={demo}
        theme={theme}
        toggleTheme={toggleTheme}
        onHome={() => go("components")}
        onCode={(id) => go(id ? `code/${id}` : "code")}
      />
    );
  }

  return (
    <div className="shell">
      <Sidebar
        route={route.page}
        go={go}
        theme={theme}
        toggleTheme={toggleTheme}
        onBrand={() => go("components")}
      />

      <main className="main">
        {route.page === "code" ? (
          <>
            <div className="main-head">
              <div>
                <h1>{codeEntry ? `${codeEntry.title} source` : "Copy the code"}</h1>
                <p>
                  {codeEntry
                    ? "The full source for this component — JSX, CSS and a usage example. Install the dependencies and drop the files into any React app with a bundler."
                    : "Every component as plain JSX + CSS files. Drop them into any React app that already has a bundler (Vite, Next, CRA) and install the listed dependencies."}
                </p>
              </div>
              <div className="main-actions">
                <button
                  type="button"
                  className="pill"
                  onClick={() => go(codeEntry ? `components/${codeEntry.id}` : "components")}
                >
                  {codeEntry ? "Back to component" : "Back to components"}
                </button>
              </div>
            </div>
            <CodePage key={route.slug ?? "all"} slug={route.slug} />
          </>
        ) : route.page === "pricing" ? (
          <PricingPage />
        ) : (
          <Home demo={demo} />
        )}
      </main>
    </div>
  );
}
