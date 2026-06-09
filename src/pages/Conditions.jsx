import { useEffect, useState, useRef } from "react";
import Header from "../components/Header";

export default function ConditionsPage() {
  const [theme, setTheme] = useState("dark");
  const [textVisible, setTextVisible] = useState(false);
  const videoRef = useRef(null);

  // Theme detection
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isLight = document.body.classList.contains("light-bg");
      setTheme(isLight ? "light" : "dark");
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    setTheme(document.body.classList.contains("light-bg") ? "light" : "dark");
    return () => observer.disconnect();
  }, []);

  // Fade-in text
  useEffect(() => {
    const timer = setTimeout(() => setTextVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Reload video on mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, []);

  const borderColor = theme === "light" ? "#2c6e2c" : "#9afc97";
  const textColor = borderColor;
  const backgroundColor = theme === "light" ? "rgba(245, 243, 239, 0.95)" : "rgba(0, 0, 0, 0.3)";

  const paragraphText = `Magnetic Fields by Florence To\n\nA landscape rarely changes all at once. The first signs arrive in places that are difficult to name: in the air before weather turns, in the altered timing of a bird's return, in the thinning of a sound that once held a place. Before anything can be identified, something is already felt. A route once known begins to feel unsettled; the horizon remains unchanged, yet the relations that gave it meaning seem to have shifted just out of reach. Frequencies move continuously through air, soil, water, and living systems. Some register as sound or vibration; others remain imperceptible, shaping conditions beyond the limits of attention. Birds navigate through magnetic fields, pressure, temperature, memory, and seasonal cycles. When these rhythms are disturbed, silence gathers where density once held and continuity begins to loosen. The landscape registers these shifts through response: a bird veers, a soundscape thins, a body senses unease before it can explain why. What disappears does not vanish entirely. It leaves traces in movement, interruption, and altered relation. These traces ripple beyond ecology into everyday life, shaping how we orient ourselves, move through space, and make sense of the worlds we inhabit. What is sensed in the field is not separate from lived conditions, but part of a shared atmosphere in which ecological, technological, and human forms of life are entangled, and where shifts in one register quietly reorganise the possibilities of another.`;

  return (
    <div>
      <Header />
      <div style={{ width: "100%", padding: "0.6rem" }}>
        {/* Text box */}
        <div
          className="conditions-box"
          style={{
            border: `1px solid ${borderColor}`,
            padding: "1.3rem 1.5rem 0.8rem 1.5rem",
            backgroundColor: backgroundColor,
            color: textColor,
            fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
            fontSize: "clamp(0.67rem, 3.8vw, 1.3rem)",
            lineHeight: 1.5,
            fontWeight: 200,
            letterSpacing: "0.02em",
            width: "100%",
            boxSizing: "border-box",
            opacity: textVisible ? 1 : 0,
            transition: "opacity 1000ms ease",
          }}
        >
          <p style={{ margin: 0, paddingBottom: "0.5rem" }}>{paragraphText}</p>
        </div>

        {/* Video player */}
        <div
          style={{
            marginTop: "2rem",
            width: "100%",
            backgroundColor: "#000",
            border: `1px solid ${borderColor}`,
            borderRadius: "0px",
            overflow: "hidden",
          }}
        >
          <video
            ref={videoRef}
            controls
            preload="auto"
            playsInline
            poster="/video-poster.jpg"
            style={{ width: "100%", display: "block" }}
          >
            <source src="/videos/field-conditions.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Image 1: diagram.jpg */}
        <div
          style={{
            marginTop: "2rem",
            width: "100%",
            border: `1px solid ${borderColor}`,
            borderRadius: "0px",
            overflow: "hidden",
            backgroundColor: "#fff",
          }}
        >
          <img
            src="/diagram.jpg"
            alt="Diagram"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>

        {/* Image 2: book-sketch.jpg */}
        <div
          style={{
            marginTop: "2rem",
            width: "100%",
            border: `1px solid ${borderColor}`,
            borderRadius: "0px",
            overflow: "hidden",
            backgroundColor: "#fff",
          }}
        >
          <img
            src="/book-sketch.jpg"
            alt="Book sketch"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>

        {/* Image 3: schematics.jpg */}
        <div
          style={{
            marginTop: "2rem",
            width: "100%",
            border: `1px solid ${borderColor}`,
            borderRadius: "0px",
            overflow: "hidden",
            backgroundColor: "#fff",
          }}
        >
          <img
            src="/schematics.jpg"
            alt="Schematics"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>
      </div>
    </div>
  );
}