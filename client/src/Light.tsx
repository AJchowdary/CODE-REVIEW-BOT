import { useRef } from "react";
import { motion, useMotionValue, animate, useTransform } from "framer-motion";
import "./App.css";

interface LightProps {
  isOn: boolean;
  setIsOn: React.Dispatch<React.SetStateAction<boolean>>;
}

const BULB_WIDTH = 60;
const BULB_HEIGHT = 100;

const Light = ({ isOn, setIsOn }: LightProps) => {
  const pullY = useMotionValue(0);
  const stringLength = useTransform(pullY, [0, 200], [40, 180]);
  const bulbScale = useTransform(pullY, [0, 200], [1, 1.08]);
  const handleScale = useTransform(pullY, [0, 200], [1, 1.18]);
  const pullingRef = useRef(false);
  const housingRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (pullingRef.current && housingRef.current) {
      const rect = housingRef.current.getBoundingClientRect();
      const offset = e.clientY - rect.top - BULB_HEIGHT;
      pullY.set(Math.max(0, Math.min(offset, 200)));
    }
  };

  const handleMouseUp = () => {
    if (pullingRef.current) {
      pullingRef.current = false;
      const strength = pullY.get();
      const velocity = strength / 10;

      // Always bounce the cord back with a spring
      animate(pullY, 0, {
        type: "spring",
        stiffness: 500,
        damping: 18,
        velocity: -velocity,
      });

      // Toggle ON/OFF if pulled far enough
      if (strength > 80) {
        setIsOn((prev) => !prev);
      }
    }
  };

  return (
    <div
      className={`light-container ${isOn ? "day" : "night"}`}
      style={{
        background: isOn
          ? "linear-gradient(180deg, #232323 0%, #fffbe6 100%)"
          : "#181818",
        transition: "background 0.7s",
      }}
    >
      <div className="bulb-area">
        <div
          className="bulb-housing"
          ref={housingRef}
          style={{ width: BULB_WIDTH, height: BULB_HEIGHT + 180 }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Bulb (on top, z-index: 2) */}
          <motion.div className="bulb" style={{ scale: bulbScale, zIndex: 2 }}>
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
          {/* Cord (behind, z-index: 1), attached to bulb base */}
          <motion.div
            className="cord"
            style={{
              height: stringLength,
              zIndex: 1,
              left: "50%",
              top: BULB_HEIGHT - 10, // attach to bulb base
              transform: "translateX(-50%)",
            }}
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
        </div>
      </div>
    </div>
  );
};

export default Light;






