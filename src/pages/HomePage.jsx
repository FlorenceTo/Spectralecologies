import Header from "../components/Header";
import FrequencyWave from "../components/FrequencyWave";
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

  // Radar bands based on your data
  const bands = [
    { name: "L-Band (1-2 GHz)", color: "rgb(250,15,5)" },
    { name: "S-Band (2-4 GHz)", color: "rgb(128,128,128)" },
    { name: "X-Band (8-12 GHz)", color: "rgb(0,245,10)" },
    { name: "UHF (300 MHz - 1 GHz)", color: "rgb(0,10,245)" },
    { name: "C-Band (4-8 GHz)", color: "rgb(255,255,0)" },
    { name: "Ku-Band (12-18 GHz)", color: "rgb(143,0,207)" },
  ];

  return (
    <div>
      <Header />
      <div className="container">
        <h1>Aelectrosonic</h1>
        <p>A: “pertaining to.” Electro-: electricity or electromagnetic phenomena. Sonic: sound waves.</p>
        
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
    </div>
  );
}