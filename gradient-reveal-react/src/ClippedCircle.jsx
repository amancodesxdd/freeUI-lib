import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import "./styles/clipped-circle.css";

/**
 * A cursor-following spotlight that reveals a soft glowing circle wherever the
 * pointer moves inside the container. Attaches mouse listeners to its parent,
 * so it must be a direct child of a `position: relative; overflow: hidden` box.
 * Ported from the unlumen UI `ClippedCircle` primitive.
 */
export default function ClippedCircle({
  className = "",
  circleClassName = "",
  circleSize = 400,
}) {
  const containerRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [position, setPosition] = useState({ x: "50%", y: "50%" });

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !container.parentElement) return;

    const parent = container.parentElement;

    const toPosition = (e) => {
      const rect = parent.getBoundingClientRect();
      return {
        x: `${((e.clientX - rect.left) / rect.width) * 100}%`,
        y: `${((e.clientY - rect.top) / rect.height) * 100}%`,
      };
    };

    const handleMouseEnter = (e) => {
      setPosition(toPosition(e));
      setHovered(true);
    };

    const handleMouseMove = (e) => {
      setPosition(toPosition(e));
    };

    const handleMouseLeave = () => {
      setHovered(false);
    };

    parent.addEventListener("mouseenter", handleMouseEnter);
    parent.addEventListener("mousemove", handleMouseMove);
    parent.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      parent.removeEventListener("mouseenter", handleMouseEnter);
      parent.removeEventListener("mousemove", handleMouseMove);
      parent.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div ref={containerRef} className={`cc ${className}`.trim()}>
      <motion.div
        className={`cc-dot ${circleClassName}`.trim()}
        style={{
          left: position.x,
          top: position.y,
          width: circleSize,
          height: circleSize,
        }}
        initial={{ scale: 0, x: "-50%", y: "-50%" }}
        animate={{ scale: hovered ? 1 : 0, x: "-50%", y: "-50%" }}
        transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
      />
    </div>
  );
}
