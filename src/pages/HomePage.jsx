import Header from "../components/Header";
import FrequencyWave from "../components/FrequencyWave";
import SpectrumBar from "../components/SpectrumBar";  // ← add this import
import { useState, useEffect } from "react";

export default function HomePage() {
  // Detect theme (same as timeline page)
  const [theme, setTheme] = useState("dark");
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isLight = document.body.classList.contains("light-bg");
      setTheme(isLight ? "light" : "dark");
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    setTheme(document.body.classList.contains("light-bg") ? "light" : "dark");
    return () => observer.disconnect();
  }, []);

  // Radar bands based on your data (fixed the quote syntax)
  const bands = [
    { name: "L-Band (1-2 GHz)", color: "#cdfa05" },
    { name: "S-Band (2-4 GHz)", color: "#0ceb00" },
    { name: "X-Band (8-12 GHz)", color: "#0926ff" },
    { name: "UHF (300 MHz - 1 GHz)", color: "#ff9706" },
    { name: "C-Band (4-8 GHz)", color: "#00ffd9" },
    { name: "Ku-Band (12-18 GHz)", color: "#4800ff" },
  ];

  // Optional: handle band selection from the SpectrumBar
  const handleBandSelect = (bandName) => {
    console.log(`Selected band: ${bandName}`);
    // You can add logic to scroll to or highlight a specific wave card
  };

  return (
    <div>
      <Header />
      <div className="container">
        <h1>Spectral Ecologies</h1>
        <p>Spectral: relating to spectra, frequencies, and forms of presence beyond immediate perception, from the electromagnetic spectrum to spectral traces and resonances. The animated bands correspond to frequencies within the electromagnetic spectrum, including L, S, and X bands commonly associated with radar, satellite, and sensing systems. The project investigates the ecological and atmospheric conditions produced through electromagnetic transmission, acoustic sensing, and migratory environments.</p>
        
        <div className="wave-grid">
          {bands.map((band) => (
            <div key={band.name} className="wave-card">
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

      {/* SpectrumBar fixed at bottom */}
      <SpectrumBar onBandSelect={handleBandSelect} />

      {/* Add some bottom padding so content doesn't hide behind the bar */}
      <style jsx>{`
        .container {
          padding-bottom: 50px;
        }
        .wave-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }
        .wave-card {
          border: 1px solid #9afc97;
          background: rgba(0, 0, 0, 0.2);
          padding: 1rem;
          border-radius: 8px;
        }
        .wave-card h3 {
          margin-bottom: 1rem;
          font-size: 1rem;
        }
        .wave-canvas-container {
          width: 100%;
          height: 100px;
        }
        body.light-bg .wave-card {
          border-color: #2c6e2c;
          background: rgba(255, 255, 255, 0.8);
        }
        @media (max-width: 768px) {
          .wave-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}