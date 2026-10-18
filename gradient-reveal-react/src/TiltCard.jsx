import Tilt from "./Tilt";
import ClippedCircle from "./ClippedCircle";
import "./styles/tilt-card.css";

/* Self-contained dashboard mock used by the demos (no network request). */
const DASHBOARD_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="576" height="448" viewBox="0 0 576 448">
  <rect width="576" height="448" rx="18" fill="#0e1016"/>
  <rect width="576" height="52" rx="18" fill="#151824"/>
  <rect y="34" width="576" height="18" fill="#151824"/>
  <circle cx="26" cy="26" r="6" fill="#ff5f57"/>
  <circle cx="46" cy="26" r="6" fill="#febc2e"/>
  <circle cx="66" cy="26" r="6" fill="#28c840"/>
  <rect x="24" y="84" width="140" height="12" rx="6" fill="#242a3a"/>
  <rect x="24" y="110" width="96" height="10" rx="5" fill="#1b2030"/>
  <rect x="24" y="150" width="150" height="60" rx="12" fill="#141926"/>
  <rect x="24" y="226" width="150" height="60" rx="12" fill="#141926"/>
  <rect x="24" y="302" width="150" height="60" rx="12" fill="#141926"/>
  <rect x="200" y="84" width="352" height="180" rx="14" fill="#141926"/>
  <polyline points="224,224 264,196 304,210 344,150 384,172 424,120 464,140 520,96"
    fill="none" stroke="#6d8cff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M224 224 L264 196 L304 210 L344 150 L384 172 L424 120 L464 140 L520 96 L520 244 L224 244 Z"
    fill="#6d8cff" opacity="0.14"/>
  <rect x="200" y="284" width="168" height="120" rx="14" fill="#141926"/>
  <rect x="384" y="284" width="168" height="120" rx="14" fill="#141926"/>
  <rect x="220" y="360" width="24" height="26" rx="4" fill="#334063"/>
  <rect x="256" y="336" width="24" height="50" rx="4" fill="#42538a"/>
  <rect x="292" y="350" width="24" height="36" rx="4" fill="#334063"/>
  <rect x="328" y="318" width="24" height="68" rx="4" fill="#6d8cff"/>
  <circle cx="468" cy="336" r="34" fill="none" stroke="#242a3a" stroke-width="12"/>
  <circle cx="468" cy="336" r="34" fill="none" stroke="#34d399" stroke-width="12"
    stroke-dasharray="150 214" stroke-linecap="round" transform="rotate(-90 468 336)"/>
</svg>`;

export const TILT_PREVIEW_IMG =
  "data:image/svg+xml;charset=utf-8," + encodeURIComponent(DASHBOARD_SVG);

/**
 * A card with 3D spring tilt, an optional floating image, a split badge pill
 * and a cursor-following radial shine on hover. Built on the Tilt and
 * ClippedCircle primitives. Ported from the unlumen UI `TiltCard`.
 */
export default function TiltCard({
  title,
  description,
  price,
  badgeLabel,
  badgeVariant = "success",
  imageSrc,
  imageAlt = "",
  href,
  children,
  tiltProps,
  className = "",
  reduced = false,
  ...props
}) {
  const inner = (
    <Tilt
      rotationFactor={11}
      muted={reduced}
      {...tiltProps}
      className={`tilt-card ${className}`.trim()}
    >
      <div className="tc-top">
        <div className="tc-copy">
          <h2 className="tc-title">{title}</h2>
          {description && <p className="tc-desc">{description}</p>}
          {children && <div className="tc-children">{children}</div>}
        </div>

        {price && badgeLabel ? (
          <div className="tc-badge">
            <span className="tc-badge-left">{price}</span>
            <span className={`tc-badge-right ${badgeVariant}`}>{badgeLabel}</span>
          </div>
        ) : price ? (
          <span className="tc-pill">{price}</span>
        ) : null}
      </div>

      {imageSrc && (
        <img
          className="tc-image"
          src={imageSrc}
          alt={imageAlt}
          width={288}
          height={224}
          loading="lazy"
          decoding="async"
        />
      )}

      <ClippedCircle circleClassName="tc-shine" circleSize={800} />
    </Tilt>
  );

  if (href) {
    return (
      <a className="tc-shell" href={href} {...props}>
        {inner}
      </a>
    );
  }

  return (
    <div className="tc-shell" {...props}>
      {inner}
    </div>
  );
}
