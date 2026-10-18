import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import "./styles/matrix.css";

/** Clamp a brightness value to the 0–1 range. */
export function clamp(value) {
  return Math.max(0, Math.min(1, value));
}

function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

function ensureFrameSize(frame, rows, cols) {
  const result = [];
  for (let r = 0; r < rows; r++) {
    const row = frame[r] || [];
    result.push([]);
    for (let c = 0; c < cols; c++) {
      result[r][c] = row[c] ?? 0;
    }
  }
  return result;
}

function useAnimation(frames, { fps, autoplay, loop, onFrame }) {
  const [frameIndex, setFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const frameIdRef = useRef(undefined);
  const lastTimeRef = useRef(0);
  const accumulatorRef = useRef(0);

  useEffect(() => {
    if (!frames || frames.length === 0 || !isPlaying) return;

    const frameInterval = 1000 / fps;

    const animate = (currentTime) => {
      if (lastTimeRef.current === 0) lastTimeRef.current = currentTime;

      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;
      accumulatorRef.current += deltaTime;

      if (accumulatorRef.current >= frameInterval) {
        accumulatorRef.current -= frameInterval;

        setFrameIndex((prev) => {
          const next = prev + 1;
          if (next >= frames.length) {
            if (loop) {
              onFrame && onFrame(0);
              return 0;
            }
            setIsPlaying(false);
            return prev;
          }
          onFrame && onFrame(next);
          return next;
        });
      }

      frameIdRef.current = requestAnimationFrame(animate);
    };

    frameIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
    };
  }, [frames, isPlaying, fps, loop, onFrame]);

  useEffect(() => {
    setFrameIndex(0);
    setIsPlaying(autoplay);
    lastTimeRef.current = 0;
    accumulatorRef.current = 0;
  }, [frames, autoplay]);

  return { frameIndex, isPlaying };
}

/** Create a blank Frame filled with zeros. */
export function emptyFrame(rows, cols) {
  return Array.from({ length: rows }, () => Array(cols).fill(0));
}

/** Write a brightness value to a single cell (mutates in-place). */
export function setPixel(frame, row, col, value) {
  if (row >= 0 && row < frame.length && col >= 0 && col < frame[0].length) {
    frame[row][col] = value;
  }
}

/* ------------------------------- built-ins -------------------------------- */

export const digits = [
  [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  [
    [0, 0, 1, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
  ],
  [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 1, 1, 0],
    [0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  [
    [0, 0, 0, 1, 0],
    [0, 0, 1, 1, 0],
    [0, 1, 0, 1, 0],
    [1, 0, 0, 1, 0],
    [1, 1, 1, 1, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 0, 1, 0],
  ],
  [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  [
    [1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0],
  ],
  [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
];

export const chevronLeft = [
  [0, 0, 0, 1, 0],
  [0, 0, 1, 0, 0],
  [0, 1, 0, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 0, 1, 0],
];

export const chevronRight = [
  [0, 1, 0, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 0, 1, 0],
  [0, 0, 1, 0, 0],
  [0, 1, 0, 0, 0],
];

/** Rotating arc loader — 12 frames, 7×7. */
export const loader = (() => {
  const frames = [];
  const size = 7;
  const center = 3;
  const radius = 2.5;

  for (let frame = 0; frame < 12; frame++) {
    const f = emptyFrame(size, size);
    for (let i = 0; i < 8; i++) {
      const angle = (frame / 12) * Math.PI * 2 + (i / 8) * Math.PI * 2;
      const x = Math.round(center + Math.cos(angle) * radius);
      const y = Math.round(center + Math.sin(angle) * radius);
      const brightness = 1 - i / 10;
      setPixel(f, y, x, Math.max(0.2, brightness));
    }
    frames.push(f);
  }

  return frames;
})();

/** Expanding ring pulse — 16 frames, 7×7. */
export const pulse = (() => {
  const frames = [];
  const size = 7;
  const center = 3;

  for (let frame = 0; frame < 16; frame++) {
    const f = emptyFrame(size, size);
    const phase = (frame / 16) * Math.PI * 2;
    const intensity = (Math.sin(phase) + 1) / 2;

    setPixel(f, center, center, 1);

    const radius = Math.floor((1 - intensity) * 3) + 1;
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (Math.abs(dist - radius) < 0.7) {
          setPixel(f, center + dy, center + dx, intensity * 0.6);
        }
      }
    }

    frames.push(f);
  }

  return frames;
})();

/** Generate a VU meter Frame from an array of levels (7 rows). */
export function vu(columns, levels) {
  const rows = 7;
  const frame = emptyFrame(rows, columns);

  for (let col = 0; col < Math.min(columns, levels.length); col++) {
    const level = Math.max(0, Math.min(1, levels[col]));
    const height = Math.floor(level * rows);

    for (let row = 0; row < rows; row++) {
      const rowFromBottom = rows - 1 - row;
      if (rowFromBottom < height) {
        let brightness = 1;
        if (row < rows * 0.3) {
          brightness = 1;
        } else if (row < rows * 0.6) {
          brightness = 0.8;
        } else {
          brightness = 0.6;
        }
        frame[row][col] = brightness;
      }
    }
  }

  return frame;
}

/** Sinusoidal travelling wave — 24 frames, 7×7. */
export const wave = (() => {
  const frames = [];
  const rows = 7;
  const cols = 7;

  for (let frame = 0; frame < 24; frame++) {
    const f = emptyFrame(rows, cols);
    const phase = (frame / 24) * Math.PI * 2;

    for (let col = 0; col < cols; col++) {
      const colPhase = (col / cols) * Math.PI * 2;
      const height = Math.sin(phase + colPhase) * 2.5 + 3.5;
      const row = Math.floor(height);

      if (row >= 0 && row < rows) {
        setPixel(f, row, col, 1);
        const frac = height - row;
        if (row > 0) setPixel(f, row - 1, col, 1 - frac);
        if (row < rows - 1) setPixel(f, row + 1, col, frac);
      }
    }

    frames.push(f);
  }

  return frames;
})();

/** Spiral-filling snake — one frame per cell, 7×7. */
export const snake = (() => {
  const frames = [];
  const rows = 7;
  const cols = 7;
  const path = [];

  let x = 0;
  let y = 0;
  let dx = 1;
  let dy = 0;

  const visited = new Set();
  while (path.length < rows * cols) {
    path.push([y, x]);
    visited.add(`${y},${x}`);

    let nextX = x + dx;
    let nextY = y + dy;

    if (
      nextX >= 0 &&
      nextX < cols &&
      nextY >= 0 &&
      nextY < rows &&
      !visited.has(`${nextY},${nextX}`)
    ) {
      x = nextX;
      y = nextY;
    } else {
      const newDx = -dy;
      const newDy = dx;
      dx = newDx;
      dy = newDy;

      nextX = x + dx;
      nextY = y + dy;

      if (
        nextX >= 0 &&
        nextX < cols &&
        nextY >= 0 &&
        nextY < rows &&
        !visited.has(`${nextY},${nextX}`)
      ) {
        x = nextX;
        y = nextY;
      } else {
        break;
      }
    }
  }

  const snakeLength = 5;
  for (let frame = 0; frame < path.length; frame++) {
    const f = emptyFrame(rows, cols);

    for (let i = 0; i < snakeLength; i++) {
      const idx = frame - i;
      if (idx >= 0 && idx < path.length) {
        const [py, px] = path[idx];
        const brightness = 1 - i / snakeLength;
        setPixel(f, py, px, brightness);
      }
    }

    frames.push(f);
  }

  return frames;
})();

/* --------------------------------- Matrix --------------------------------- */

/**
 * A retro dot-matrix display with circular cells, radial-glow pixels and
 * smooth frame transitions. Ported from ElevenLabs UI / unlumen UI.
 */
export const Matrix = forwardRef(function Matrix(
  {
    rows,
    cols,
    pattern,
    frames,
    fps = 12,
    autoplay = true,
    loop = true,
    size = 10,
    gap = 2,
    palette = {
      on: "currentColor",
      off: "var(--muted-foreground)",
    },
    brightness = 1,
    ariaLabel,
    onFrame,
    mode = "default",
    levels,
    reduced = false,
    className,
    ...props
  },
  ref
) {
  const { frameIndex } = useAnimation(frames, {
    fps,
    autoplay: autoplay && !pattern && !reduced,
    loop,
    onFrame,
  });

  const currentFrame = useMemo(() => {
    if (mode === "vu" && levels && levels.length > 0) {
      return ensureFrameSize(vu(cols, levels), rows, cols);
    }
    if (pattern) return ensureFrameSize(pattern, rows, cols);
    if (frames && frames.length > 0) {
      return ensureFrameSize(frames[frameIndex] || frames[0], rows, cols);
    }
    return ensureFrameSize([], rows, cols);
  }, [pattern, frames, frameIndex, rows, cols, mode, levels]);

  const cellPositions = useMemo(() => {
    const positions = [];
    for (let row = 0; row < rows; row++) {
      positions[row] = [];
      for (let col = 0; col < cols; col++) {
        positions[row][col] = {
          x: col * (size + gap),
          y: row * (size + gap),
        };
      }
    }
    return positions;
  }, [rows, cols, size, gap]);

  const svgDimensions = useMemo(
    () => ({
      width: cols * (size + gap) - gap,
      height: rows * (size + gap) - gap,
    }),
    [rows, cols, size, gap]
  );

  const isAnimating = !pattern && frames && frames.length > 0;

  return (
    <div
      ref={ref}
      role="img"
      aria-label={ariaLabel ?? "matrix display"}
      aria-live={isAnimating ? "polite" : undefined}
      className={cx("matrix", reduced && "reduced", className)}
      style={{
        "--matrix-on": palette.on,
        "--matrix-off": palette.off,
        "--matrix-gap": `${gap}px`,
        "--matrix-size": `${size}px`,
      }}
      {...props}
    >
      <svg
        width={svgDimensions.width}
        height={svgDimensions.height}
        viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
        xmlns="http://www.w3.org/2000/svg"
        className="matrix-svg"
        style={{ overflow: "visible" }}
      >
        <defs>
          <radialGradient id="matrix-pixel-on" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--matrix-on)" stopOpacity="1" />
            <stop offset="70%" stopColor="var(--matrix-on)" stopOpacity="0.85" />
            <stop offset="100%" stopColor="var(--matrix-on)" stopOpacity="0.6" />
          </radialGradient>

          <radialGradient id="matrix-pixel-off" cx="50%" cy="50%" r="50%">
            <stop
              offset="0%"
              stopColor="var(--muted-foreground)"
              stopOpacity="1"
            />
            <stop
              offset="100%"
              stopColor="var(--muted-foreground)"
              stopOpacity="0.7"
            />
          </radialGradient>

          <filter id="matrix-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {currentFrame.map((row, rowIndex) =>
          row.map((value, colIndex) => {
            const pos = cellPositions[rowIndex]?.[colIndex];
            if (!pos) return null;

            const opacity = clamp(brightness * value);
            const isActive = opacity > 0.5;
            const isOn = opacity > 0.05;
            const fill = isOn
              ? "url(#matrix-pixel-on)"
              : "url(#matrix-pixel-off)";

            const scale = isActive ? 1.1 : 1;
            const radius = (size / 2) * 0.9;

            return (
              <circle
                key={`${rowIndex}-${colIndex}`}
                className={cx(
                  "matrix-pixel",
                  isActive && "matrix-pixel-active",
                  !isOn && "matrix-pixel-off"
                )}
                cx={pos.x + size / 2}
                cy={pos.y + size / 2}
                r={radius}
                fill={fill}
                opacity={isOn ? opacity : undefined}
                style={{ transform: `scale(${scale})` }}
              />
            );
          })
        )}
      </svg>
    </div>
  );
});

Matrix.displayName = "Matrix";

/* ------------------------------ site helpers ------------------------------ */

/** Map a preset index to the props that drive a Matrix (demo helper). */
export function matrixSource(preset) {
  switch (preset) {
    case 1:
      return { rows: 7, cols: 7, frames: loader };
    case 2:
      return { rows: 7, cols: 7, frames: pulse };
    case 3:
      return { rows: 7, cols: 7, frames: wave };
    case 4:
      return { rows: 7, cols: 7, frames: snake };
    case 5:
      return { rows: 7, cols: 8, vu: true };
    default:
      return { rows: 7, cols: 5, pattern: digits[7] };
  }
}

/** Live VU meter — random levels for demo purposes. */
export function MatrixVuDemo({
  rows = 7,
  cols = 8,
  size = 12,
  gap = 3,
  brightness = 1,
  reduced = false,
}) {
  const [levels, setLevels] = useState(() =>
    Array.from({ length: cols }, () => 0.4 + Math.random() * 0.5)
  );

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      setLevels((prev) =>
        prev.map((v) => {
          const next = v + (Math.random() - 0.5) * 0.55;
          return Math.max(0.08, Math.min(1, next));
        })
      );
    }, 240);
    return () => clearInterval(id);
  }, [reduced, cols]);

  return (
    <Matrix
      rows={rows}
      cols={cols}
      mode="vu"
      levels={levels}
      size={size}
      gap={gap}
      brightness={brightness}
      reduced={reduced}
      ariaLabel="vu meter"
    />
  );
}

export default Matrix;
