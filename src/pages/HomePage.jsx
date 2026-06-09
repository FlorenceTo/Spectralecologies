import Header from "../components/Header";
import FrequencyWave from "../components/FrequencyWave";
import SpectrumBar from "../components/SpectrumBar";
import { useState, useEffect, useRef } from "react";

export default function HomePage() {
  const [theme, setTheme] = useState("dark");
  const [selectedBand, setSelectedBand] = useState(null);
  const bandRefs = useRef({});

  // Detect theme
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isLight = document.body.classList.contains("light-bg");
      setTheme(isLight ? "light" : "dark");
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    setTheme(document.body.classList.contains("light-bg") ? "light" : "dark");
    return () => observer.disconnect();
  }, []);

  // Radar bands with full names and short names for matching
  const bands = [
    { name: "UHF (300 MHz - 1 GHz)", fullName: "UHF", color: "#ff9706" },
    { name: "L-Band (1-2 GHz)", fullName: "L", color: "#cdfa05" },
    { name: "S-Band (2-4 GHz)", fullName: "S", color: "#0ceb00" },
    { name: "C-Band (4-8 GHz)", fullName: "C", color: "#00ffd9" },
    { name: "X-Band (8-12 GHz)", fullName: "X", color: "#3044de" },
    { name: "Ku-Band (12-18 GHz)", fullName: "Ku", color: "#6200ff" },
  ];

  const handleBandSelect = (shortName) => {
    // Find the band that matches the short name (e.g., "UHF", "L", "X")
    const matchedBand = bands.find(band => band.fullName === shortName);
    if (matchedBand) {
      setSelectedBand(matchedBand.name);
      // Scroll to the card
      const cardElement = bandRefs.current[matchedBand.name];
      if (cardElement) {
        cardElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      // Remove highlight after 2 seconds
      setTimeout(() => setSelectedBand(null), 2000);
    }
  };

  return (
    <div>
      <Header />
      <div className="container">
        <h1>Spectral Ecologies</h1>
        <p>Spectral: relating to spectra, frequencies, and forms of presence beyond immediate perception, from the electromagnetic spectrum to spectral traces and resonances. The animated bands correspond to frequencies within the electromagnetic spectrum, including L, S, and X bands commonly associated with radar, satellite, and sensing systems. The project investigates the ecological and atmospheric conditions produced through electromagnetic transmission, acoustic sensing, and migratory environments.</p>
        
        <div className="wave-grid">
          {bands.map((band) => (
            <div 
              key={band.name} 
              className={`wave-card ${selectedBand === band.name ? "highlight" : ""}`}
              ref={(el) => (bandRefs.current[band.name] = el)}
            >
              <h3>{band.name}</h3>
              <div className="wave-canvas-container">
                <FrequencyWave 
                  bandName={band.name} 
                  primaryColor={band.color} 
                  theme={theme} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <SpectrumBar onBandSelect={handleBandSelect} />

      <style jsx>{`
        .container {
          padding-bottom: 60px;
        }
        .wave-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr); /* exactly 3 columns on desktop */
          gap: 1.5rem;
          margin-top: 2rem;
        }
        .wave-card {
          border: 1px solid #9afc97;
          background: rgba(0, 0, 0, 0.2);
          padding: 1rem;
          border-radius: 0px;
          transition: all 0.2s ease;
          /* Ensure all cards have same height */
          display: flex;
          flex-direction: column;
        }
        .wave-card.highlight {
          border: 2px solid #ffd700;
          box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
        }
        .wave-card h3 {
          margin-bottom: 1rem;
          font-size: 1rem;
        }
        .wave-canvas-container {
          width: 100%;
          height: 100px;
          flex-shrink: 0;
        }
        body.light-bg .wave-card {
          border-color: #2c6e2c;
          background: rgba(255, 255, 255, 0.8);
        }
        body.light-bg .wave-card.highlight {
          border-color: #ff8c00;
          box-shadow: 0 0 10px rgba(255, 140, 0, 0.5);
        }

        /* Tablet: 2 columns */
        @media (max-width: 900px) {
          .wave-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* Mobile: 1 column */
        @media (max-width: 600px) {
          .wave-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}