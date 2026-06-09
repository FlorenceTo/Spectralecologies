import { useEffect, useState } from "react";
import Header from "../components/Header";

export default function AboutPage() {
  const [theme, setTheme] = useState("dark");

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

  const borderColor = theme === "light" ? "#2c6e2c" : "#9afc97";
  const textColor = borderColor;
  const backgroundColor = theme === "light" ? "rgba(245, 243, 239, 0.95)" : "rgba(0, 0, 0, 0.3)";

  return (
    <div>
      <Header />
      <div style={{ width: "100%", padding: "0.6rem" }}>
        <div
          className="about-box"
          style={{
            border: `1px solid ${borderColor}`,
            padding: "1.3rem 1.5rem 0.8rem 1.5rem",
            backgroundColor: backgroundColor,
            color: textColor,
            fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
            fontSize: "clamp(0.6rem, 3.5vw, 1.2rem)",
            lineHeight: 1.5,
            fontWeight: 300,
            letterSpacing: "0.02em",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <p style={{ margin: "0 0 1rem 0" }}>
            Welcome to this page. You are here because I or a close friend shared with you this link. Spectral Ecologies is a private research space and not a public archive. I’d be grateful if you didn’t share the URL without asking. Thank you for your respect. If you’re interested in getting in touch or seeing my existing work, please visit{" "}
            <a 
              href="https://www.florence-to.com" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: borderColor, textDecoration: "underline" }}
            >
              www.florence-to.com
            </a>.
          </p>

          <p style={{ margin: "0 0 1rem 0" }}>
            <em>Spectral Ecologies</em> is a long‑term artistic research project that listens to the intersection of sound, ecology, and politics as they unfold in site‑specific places. The archive includes recordings from Hebron, Jericho, Haifa, and other locations. Each audio file is accompanied by a spectrogram and field notes. The map interface allows you to explore the sonic geography of the region.
          </p>

          <p style={{ margin: 0 }}>
            <strong>Magnetic Fields – Florence To (2025)</strong>
          </p>
        </div>
      </div>
    </div>
  );
}