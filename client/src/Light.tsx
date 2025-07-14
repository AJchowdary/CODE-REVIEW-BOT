import { useRef } from "react";
import { motion, useMotionValue, animate, useTransform } from "framer-motion";
import "./App.css";

interface LightProps {
  isOn: boolean;
  setIsOn: React.Dispatch<React.SetStateAction<boolean>>;
}

const Light = ({ isOn, setIsOn }: LightProps) => {
  const pullY = useMotionValue(0);
  const stringLength = useTransform(pullY, [0, 200], [50, 250]);
  const bulbScale = useTransform(pullY, [0, 200], [1, 1.1]);

  const pullingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (pullingRef.current && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const offset = e.clientY - rect.top - 100;
      pullY.set(Math.max(0, Math.min(offset, 200)));
    }
  };

  const handleMouseUp = () => {
    if (pullingRef.current) {
      pullingRef.current = false;
      const strength = pullY.get();
      const velocity = strength / 10;

      animate(pullY, 0, {
        type: "spring",
        stiffness: 300,
        damping: 10,
        velocity: -velocity,
      });

      if (strength > 80) {
        setIsOn((prev: boolean) => !prev);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={`light-container ${isOn ? "day" : "night"}`}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="bulb-area">
        <motion.div className="bulb" style={{ scale: bulbScale }}>
          <div className={`bulb-shape ${isOn ? "on" : "off"}`}>
            {/* SVG Bulb Shape */}
            <svg viewBox="0 0 60 100" width="60" height="100">
              <ellipse
                cx="30"
                cy="40"
                rx="24"
                ry="34"
                fill={isOn ? "#fffbe6" : "#eaeaea"}
                stroke="#bdbdbd"
                strokeWidth="4"
                filter={isOn ? "url(#bulbGlow)" : ""}
              />
              {/* Filament */}
              <path
                d="M25 55 Q30 45 35 55"
                stroke={isOn ? "#ffd700" : "#bdbdbd"}
                strokeWidth="2"
                fill="none"
              />
              {/* Filament base */}
              <circle cx="30" cy="55" r="2" fill={isOn ? "#ffd700" : "#bdbdbd"} />
              {/* Bulb base */}
              <rect
                x="22"
                y="70"
                width="16"
                height="12"
                rx="3"
                fill="#bababa"
                stroke="#888"
                strokeWidth="2"
              />
              {/* Glow filter */}
              <defs>
                <filter id="bulbGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="8" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {/* Inner glow for filament */}
              {isOn && (
                <ellipse
                  cx="30"
                  cy="48"
                  rx="10"
                  ry="10"
                  fill="#ffe066"
                  opacity="0.4"
                  filter="url(#bulbGlow)"
                />
              )}
            </svg>
          </div>
        </motion.div>
        <motion.div
          className="cord"
          style={{ height: stringLength }}
          onMouseDown={() => (pullingRef.current = true)}
        >
          <div className="handle"></div>
        </motion.div>
      </div>
    </div>
  );
};

export default Light;


