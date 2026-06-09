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

  const paragraphText = `A landscape rarely changes all at once. The first signs often arrive in places that are difficult to name: in the air before weather turns, in the altered timing of a bird's return, in the thinning of a sound that once held a place together. Before anything can be clearly identified, something is already felt. A route once known begins to feel unsettled; the horizon appears open yet strangely emptied of relation, as if the connections that once held it in place have shifted just out of reach. These changes do not appear in isolation. They move through weather, ground, water, infrastructure, and migratory paths carried across generations, so that what seems stable is already threaded through forms of movement that remain largely invisible. Frequencies pass continuously through architecture, soil, water, and living systems. Some register as sound or vibration; others remain imperceptible, yet remain active in shaping conditions. Vibration is not only acoustic but relational: a transmission moving through matter across time, carrying effects that are distributed rather than contained. Birds navigate through magnetic fields, pressure, temperature, memory, and seasonal cycles, so migration is inseparable from sensing, a way of inhabiting conditions that cannot be reduced to visibility alone. When these rhythms are disturbed, continuity begins to loosen. Silence gathers where density once held, and habitats fragment as species disperse or fail to return. These changes rarely announce themselves at once. They accumulate gradually, as relations break down and forms of orientation no longer hold in the same way. Many of the forces shaping these shifts remain beyond direct perception, yet they are materially present. Electromagnetic transmissions move through air and subsoil; radar systems operate across territories; signals circulate through atmospheric and communicative layers. The landscape registers these shifts not through declaration, but through response: a bird veers earlier than expected, a soundscape thins, a body registers unease before it can be explained. What disappears does not vanish cleanly. It leaves traces in movement, interruption, and altered relation. Absence, in this sense, is not emptiness but the residue of disrupted continuity, the imprint of what once moved differently through a space. These conditions do not remain outside human life, but take form in quieter ways: in how attention is organised, in how space is navigated, in the subtle recalibration of safety, distance, and belonging. The infrastructures that shape ecological movement also shape everyday life, not as separate systems but as overlapping conditions—how bodies move through cities, how information arrives or fails to arrive, how orientation is maintained or lost. What is sensed in the field is therefore not separate from human lived conditions, but continuous with them: a shared atmosphere in which ecological, technological, and human forms of life are entangled, and in which shifts in one register quietly reorganise the possibilities of others.`;

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