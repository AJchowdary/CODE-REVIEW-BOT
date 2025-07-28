import React, { useState, useEffect, useRef } from "react";

const clickSoundUrl =
  "https://assets.mixkit.co/sfx/preview/mixkit-light-switch-on-2585.mp3";

const IntroScreen = () => {
  const [isLightOn, setIsLightOn] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [opacity, setOpacity] = useState(1);
  const flickerCountRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isLightOn) {
      if (clickSoundRef.current) {
        clickSoundRef.current.play();
      }
      flickerCountRef.current = 0;
      intervalRef.current = setInterval(() => {
        flickerCountRef.current++;
        setOpacity(flickerCountRef.current % 2 === 0 ? 1 : 0.1);
        if (flickerCountRef.current > 4 && intervalRef.current) {
          clearInterval(intervalRef.current);
          setOpacity(0);
          setTimeout(() => {
            setShowIntro(false);
            document.body.style.backgroundColor = "#f5f5f5";
            document.body.style.overflow = "auto";
          }, 800);
        }
      }, 150);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isLightOn]);

  return (
    <>
      {showIntro ? (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "linear-gradient(145deg, #0f0f1f, #1a1a2e)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "#f5f5f5",
            textAlign: "center",
            zIndex: 1000,
            opacity,
            transition: "opacity 0.15s ease",
          }}
        >
          <h2>It's dark in here...</h2>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            <span style={{ fontSize: "1.2rem" }}>💡 Turn On the Light</span>
            <label
              style={{
                position: "relative",
                display: "inline-block",
                width: 70,
                height: 34,
              }}
            >
              <input
                type="checkbox"
                checked={isLightOn}
                onChange={() => setIsLightOn(!isLightOn)}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span
                style={{
                  position: "absolute",
                  cursor: "pointer",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: isLightOn ? "#ffd700" : "#444",
                  borderRadius: 34,
                  transition: "background-color 0.5s ease, box-shadow 0.5s ease",
                  boxShadow: isLightOn
                    ? "0 0 20px #ffd700"
                    : "none",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    content: '""',
                    height: 26,
                    width: 26,
                    left: isLightOn ? 36 : 4,
                    bottom: 4,
                    backgroundColor: isLightOn ? "#fff7d1" : "white",
                    transition: "transform 0.5s ease, background-color 0.3s",
                    borderRadius: "50%",
                    boxShadow: "0 0 10px rgba(255, 255, 255, 0.6)",
                  }}
                />
              </span>
            </label>
          </div>

          <audio
            ref={clickSoundRef}
            src={clickSoundUrl}
            preload="auto"
          />
        </div>
      ) : (
        <main
          style={{
            height: "100vh",
            background: "linear-gradient(to right, #f7f7f7, #ffffff)",
            padding: "2rem",
            animation: "fadeIn 1s ease-in-out",
          }}
        >
          <h1 style={{ fontSize: "2.5rem", color: "#222" }}>
            Welcome to Ajay's Portfolio
          </h1>
          <p>This is where your main content goes — projects, about, contact, etc.</p>
        </main>
      )}

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </>
  );
};

export default IntroScreen;







