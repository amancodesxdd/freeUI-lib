import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { PM, installCommand } from "./registry";

export default function InstallBlock({ deps }) {
  const [pm, setPm] = useState("npm");
  const [copied, setCopied] = useState(false);
  const cmd = installCommand(pm, deps);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(cmd);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = cmd;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="install-block">
      <div className="install-tabs">
        {PM.map((p) => (
          <button
            key={p}
            type="button"
            className={p === pm ? "pm-tab active" : "pm-tab"}
            onClick={() => setPm(p)}
          >
            {p}
          </button>
        ))}
        <button
          type="button"
          className="pm-copy"
          onClick={copy}
          aria-label="Copy install command"
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
        </button>
      </div>

      <pre className="install-cmd">
        <span className="c-pm">{pm}</span>
        {deps ? (
          <>
            {" i "}
            <span className="c-pkg">{deps}</span>
          </>
        ) : (
          " install"
        )}
      </pre>

      <p className="install-note">
        Then copy the files below into your project and import the stylesheet
        once (the shared <code>theme.css</code> holds the design tokens).
      </p>
    </div>
  );
}
