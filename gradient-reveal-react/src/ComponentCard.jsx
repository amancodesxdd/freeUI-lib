import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useInView } from "framer-motion";

/** Centres a preview and scales it down so it always fits inside its box. */
function PreviewStage({ children }) {
  const stageRef = useRef(null);
  const fitRef = useRef(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    const fit = fitRef.current;
    if (!stage || !fit) return;

    let frame = 0;
    const compute = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const sw = stage.clientWidth;
        const sh = stage.clientHeight;
        const cw = Math.max(fit.offsetWidth, fit.scrollWidth);
        const ch = Math.max(fit.offsetHeight, fit.scrollHeight);
        if (!cw || !ch || !sw || !sh) return;
        const next = Math.min(1, sw / cw, sh / ch);
        setScale((prev) => (Math.abs(prev - next) > 0.005 ? next : prev));
      });
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(stage);
    ro.observe(fit);
    window.addEventListener("resize", compute);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(compute).catch(() => {});
    }

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, []);

  return (
    <div className="preview-stage" ref={stageRef}>
      <div
        className="preview-fit"
        ref={fitRef}
        style={{ transform: `scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  );
}

export default function ComponentCard({
  title,
  preview = "card",
  wide = false,
  onOpen,
  children,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "-10% 0px -10% 0px" });
  const [runKey, setRunKey] = useState(0);
  const wasVisible = useRef(false);

  useEffect(() => {
    if (inView && !wasVisible.current) {
      wasVisible.current = true;
      setRunKey((k) => k + 1);
    } else if (!inView) {
      wasVisible.current = false;
    }
  }, [inView]);

  const cls = ["card-preview", preview, wide ? "wide" : null]
    .filter(Boolean)
    .join(" ");

  return (
    <article className="card" ref={ref}>
      <div className={cls}>
        <PreviewStage>
          <div key={runKey} style={{ display: "contents" }}>
            {children}
          </div>
        </PreviewStage>
      </div>

      <div className="card-foot">
        <button type="button" className="card-title" onClick={onOpen}>
          {title}
          <ArrowRight size={16} strokeWidth={2} />
        </button>
        <span className="badge free">
          <span className="badge-mark" />
          Free
        </span>
      </div>
    </article>
  );
}
