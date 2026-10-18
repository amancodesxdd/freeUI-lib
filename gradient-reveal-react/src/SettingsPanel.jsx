import { ChevronDown } from "lucide-react";
import { EASE_NAMES, variantFor } from "./motion-presets";

function Select({ value, options, onChange, label }) {
  return (
    <div className="sp-select">
      <select
        value={value}
        aria-label={label}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o, i) => (
          <option key={o} value={i}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown size={15} strokeWidth={2} />
    </div>
  );
}

function Toggle({ on, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      className={on ? "sp-switch on" : "sp-switch"}
      onClick={() => onChange(!on)}
    >
      <span className="sp-knob" />
    </button>
  );
}

function Range({ label, value, min, max, step = 1, onChange }) {
  const fill = ((value - min) / (max - min)) * 100;
  return (
    <>
      <div className="sp-row">
        <span className="sp-label">{label}</span>
        <span className="sp-value">{value}</span>
      </div>
      <input
        className="sp-range"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ "--fill": `${fill}%` }}
      />
    </>
  );
}

export default function SettingsPanel({ controls, value, onChange, onReset }) {
  const set = (key) => (v) => onChange({ ...value, [key]: v });
  const variants = variantFor(controls);

  if (controls === "snap") {
    return (
      <div className="sp">
        <header className="sp-head">
          <span className="sp-title">Settings</span>
          <button type="button" className="sp-reset" onClick={onReset}>
            Reset
          </button>
        </header>

        <div className="sp-body">
          <div className="sp-row">
            <span className="sp-label">Show Neighbors</span>
            <Toggle
              label="Show Neighbors"
              on={value.showNeighbors}
              onChange={set("showNeighbors")}
            />
          </div>

          <Range
            label="Prefix Gap"
            value={value.prefixGap}
            min={0}
            max={48}
            step={1}
            onChange={set("prefixGap")}
          />
          <Range
            label="Item Height"
            value={value.itemHeight}
            min={48}
            max={140}
            step={1}
            onChange={set("itemHeight")}
          />
          <Range
            label="Spring Stiffness"
            value={value.stiffness}
            min={80}
            max={520}
            step={10}
            onChange={set("stiffness")}
          />
        </div>
      </div>
    );
  }

  if (controls === "matrix") {
    return (
      <div className="sp">
        <header className="sp-head">
          <span className="sp-title">Settings</span>
          <button type="button" className="sp-reset" onClick={onReset}>
            Reset
          </button>
        </header>

        <div className="sp-body">
          <div className="sp-row">
            <span className="sp-label">Preset</span>
            <Select
              label="Preset"
              value={value.matrixPreset}
              options={variants}
              onChange={(v) => set("matrixPreset")(Number(v))}
            />
          </div>

          <Range
            label="Pixel Size"
            value={value.pixelSize}
            min={6}
            max={28}
            step={1}
            onChange={set("pixelSize")}
          />
          <Range
            label="Gap"
            value={value.pixelGap}
            min={0}
            max={8}
            step={1}
            onChange={set("pixelGap")}
          />
          <Range
            label="FPS"
            value={value.matrixFps}
            min={4}
            max={30}
            step={1}
            onChange={set("matrixFps")}
          />
          <Range
            label="Brightness"
            value={value.brightness}
            min={0.2}
            max={1}
            step={0.05}
            onChange={set("brightness")}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="sp">
      <header className="sp-head">
        <span className="sp-title">Settings</span>
        <button type="button" className="sp-reset" onClick={onReset}>
          Reset
        </button>
      </header>

      <div className="sp-body">
        <div className="sp-row">
          <span className="sp-label">Variant</span>
          <Select
            label="Variant"
            value={value.variant}
            options={variants}
            onChange={(v) => set("variant")(Number(v))}
          />
        </div>

        <div className="sp-row">
          <span className="sp-label">Duration</span>
          <span className="sp-value">{value.duration.toFixed(2)}</span>
        </div>
        <input
          className="sp-range"
          type="range"
          min="0.2"
          max="2"
          step="0.05"
          value={value.duration}
          aria-label="Duration"
          onChange={(e) => set("duration")(Number(e.target.value))}
          style={{ "--fill": `${((value.duration - 0.2) / 1.8) * 100}%` }}
        />

        <div className="sp-row">
          <span className="sp-label">Ease</span>
          <Select
            label="Ease"
            value={EASE_NAMES.indexOf(value.ease)}
            options={EASE_NAMES}
            onChange={(v) => set("ease")(EASE_NAMES[Number(v)])}
          />
        </div>

        <div className="sp-row">
          <span className="sp-label">Repeat</span>
          <Toggle
            label="Repeat"
            on={value.repeat}
            onChange={set("repeat")}
          />
        </div>
      </div>
    </div>
  );
}