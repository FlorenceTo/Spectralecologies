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

  // Main paragraph text (without subtitle)
  const paragraphText = `A landscape rarely changes all at once. The first signs arrive in places that are difficult to name: in the air before weather turns, in the altered timing of a bird's return, in the thinning of a sound that once held a place. Before anything can be identified, something is already felt. A route once known begins to feel unsettled; the horizon remains unchanged, yet the relations that gave it meaning seem to have shifted just out of reach. The landscape is threaded with signals, some heard, some sensed only through their effects. Birds orient through magnetic fields, pressure, temperature, memory, and seasonal cycles, reading conditions that often remain beyond human perception. When these rhythms are disturbed, silence gathers where density once held, and relations begin to fray. The landscape registers these shifts through response: a bird veers from its path, a soundscape thins, a body senses unease before it can explain why. What disappears does not vanish entirely. It leaves traces in movement, interruption, and altered relation; signs through which absence becomes perceptible. These traces are not confined to ecological systems. They shape how we orient ourselves, move through space, and make sense of the worlds we inhabit. What is sensed in the field is not separate from lived experience, but part of a shared atmosphere in which ecological, technological, and human forms of life remain entangled, each responding to shifts in the others, often long before those changes can be named.`;

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
          {/* Subtitle – on its own row, same styling as paragraph */}
          <p style={{
            margin: "0 0 0.5rem 0",
            fontSize: "inherit",
            fontWeight: "inherit",
            letterSpacing: "inherit",
            lineHeight: "inherit",
            color: theme === "light" ? "rgba(0, 0, 0, 0.85)" : "rgba(255, 255, 255, 0.85)",
          }}>
            Magnetic Fields by{" "}
            <a
              href="https://www.florence-to.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "inherit",
                textDecoration: "none",
                textUnderlineOffset: "0.5px",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Florence To
            </a>
          </p>

          {/* Main paragraph */}
          <p style={{ margin: 0, paddingBottom: "0.5rem" }}>
            {paragraphText}
          </p>
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

        {/* Image 3: archive-exp.jpg */}
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
            src="/archive-exp.jpg"
            alt="Archival evidence"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>

        {/* Image 4: schematics.jpg */}
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
            src="/schematics_2026.jpg"
            alt="Schematics"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>
      </div>
    </div>
  );
}