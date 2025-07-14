import { useRef } from "react";
import { motion, useMotionValue, animate, useTransform } from "framer-motion";
import "./App.css";

interface LightProps {
  isOn: boolean;
  setIsOn: React.Dispatch<React.SetStateAction<boolean>>;
}

const Light = ({ isOn, setIsOn }: LightProps) => {
  const pullY = useMotionValue(0);
  const stringLength = useTransform(pullY, [0, 200], [60, 220]);
  const bulbScale = useTransform(pullY, [0, 200], [1, 1.08]);
  const handleScale = useTransform(pullY, [0, 200], [1, 1.2]);
  const pullingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Mouse/touch handlers
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

      // Bounce animation
      animate(pullY, 0, {
        type: "spring",
        stiffness: 400,
        damping: 12,
        velocity: -velocity,
      });

      if (!isOn && strength > 80) {
        setIsOn(true);
      }
    }
  };

  // Hide handle when light is on
  // (optional: you can keep it visible if you want to allow turning OFF)
  return (
    <div
      ref={containerRef}
      className={`light-container ${isOn ? "day" : "night"}`}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        background: isOn
          ? "linear-gradient(180deg, #232323 0%, #fffbe6 100%)"
          : "#181818",
        transition: "background 0.7s",
      }}
    >
      <div className="bulb-area">
        {/* Cord */}
        {!isOn && (
          <motion.div
            className="cord"
            style={{ height: stringLength }}
            onMouseDown={() => (pullingRef.current = true)}
          >
            <motion.div
              className="handle"
              style={{
                scale: handleScale,
                boxShadow: "0 2px 12px #ffe06680",
                background:
                  "radial-gradient(circle at 60% 40%, #ffe066 80%, #bfae4b 100%)",
                border: "2.5px solid #bdbdbd",
              }}
            />
          </motion.div>
        )}
        {/* Bulb */}
        <motion.div className="bulb" style={{ scale: bulbScale }}>
          <div className={`bulb-shape ${isOn ? "on" : "off"}`}>
            <svg viewBox="0 0 60 100" width="60" height="100">
              {/* Bulb glass */}
              <ellipse
                cx="30"
                cy="40"
                rx="24"
                ry="34"
                fill={isOn ? "#fffbe6" : "#222"}
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
      </div>
    </div>
  );
};

export default Light;



