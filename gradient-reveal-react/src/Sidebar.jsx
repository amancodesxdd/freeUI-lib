import { Moon, Sun } from "lucide-react";

const NAV = [
  { id: "components", label: "Components" },
  { id: "pricing", label: "Pricing" },
];

export default function Sidebar({ route, go, theme, toggleTheme, onBrand }) {
  return (
    <aside className="sidebar">
      <button type="button" className="brand" onClick={onBrand}>
        <span className="brand-mark" aria-hidden="true" />
        design.x
      </button>

      <nav className="side-nav">
        {NAV.map((n) => (
          <button
            key={n.id}
            type="button"
            className={route === n.id ? "side-link active" : "side-link"}
            onClick={() => go(n.id)}
          >
            {n.label}
          </button>
        ))}
      </nav>

      <div className="side-foot">
        <button
          type="button"
          className="icon-btn"
          aria-label="Toggle theme"
          onClick={toggleTheme}
        >
          {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
        </button>
        <p className="side-note">
          Open a component for install steps and source.
          <br />
          Press T for theme.
        </p>
      </div>
    </aside>
  );
}