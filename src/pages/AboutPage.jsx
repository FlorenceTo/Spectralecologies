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
            Welcome to Spectral Ecologies. You have arrived here because this link was shared with you, either by me or through someone connected to the project. This is an ongoing research practice and a space for developing ideas, materials, and encounters rather than a public archive. I kindly ask that the URL is not shared without permission. Thank you for respecting the nature of the work and the relationships that make it possible. If you would like to learn more or get in touch, please visit{" "}
            <a 
              href="https://www.florence-to.com" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: borderColor, textDecoration: "underline" }}
            >
              florence-to.com
            </a>.
          </p>

        </div>
      </div>
    </div>
  );
}