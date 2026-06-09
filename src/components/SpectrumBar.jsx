// components/SpectrumBar.jsx
import { useRef, useEffect } from "react";

const bands = [
  { name: "HF", freq: "3–30 MHz", start: 0, color: "#ff0000" },
  { name: "VHF", freq: "30–300 MHz", start: 0.08, color: "#ff5500" },
  { name: "UHF", freq: "300–1000 MHz", start: 0.16, color: "#ff9706" },
  { name: "L", freq: "1–2 GHz", start: 0.24, color: "#cdfa05" },
  { name: "S", freq: "2–4 GHz", start: 0.32, color: "#0ceb00" },
  { name: "C", freq: "4–8 GHz", start: 0.42, color: "#00ffd9" },
  { name: "X", freq: "8–12 GHz", start: 0.52, color: "#0926ff" },
  { name: "Ku", freq: "12–18 GHz", start: 0.62, color: "#4800ff" },
  { name: "K", freq: "18–27 GHz", start: 0.72, color: "#8a2be2" },
  { name: "Ka", freq: "27–40 GHz", start: 0.82, color: "#ba55d3" },
  { name: "V", freq: "40–75 GHz", start: 0.91, color: "#ee82ee" },
  { name: "W", freq: "75–110 GHz", start: 0.97, color: "#ffffff" },
];

export default function SpectrumBar({ onBandSelect }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Function to draw the gradient on the canvas
    const drawCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      const width = canvas.clientWidth;
      canvas.width = width;
      const height = canvas.clientHeight;
      
      // Smooth gradient with many color stops
      const grad = ctx.createLinearGradient(0, 0, width, 0);
      bands.forEach((band, i) => {
        const nextStart = bands[i+1]?.start || 1;
        grad.addColorStop(band.start, band.color);
        grad.addColorStop(nextStart, bands[i+1]?.color || band.color);
      });
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    };

    // Draw initially
    drawCanvas();

    // Redraw on window resize
    window.addEventListener("resize", drawCanvas);
    
    // Cleanup listener on unmount
    return () => window.removeEventListener("resize", drawCanvas);
  }, []);

  const handleTouchOrClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX ?? (e.touches ? e.touches[0].clientX : 0);
    const x = clientX - rect.left;
    const percent = x / rect.width;
    const band = bands.find((b, i) => {
      const nextStart = bands[i+1]?.start || 1;
      return percent >= b.start && percent <= nextStart;
    });
    if (band && onBandSelect) onBandSelect(band.name);
  };

  return (
    <div 
      style={{ 
        position: "fixed", 
        bottom: 0, 
        left: 0, 
        right: 0, 
        zIndex: 20,
        cursor: "pointer"
      }}
      onTouchStart={handleTouchOrClick}
      onClick={handleTouchOrClick}
    >
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "30px", display: "block" }}
      />
      {/* Instruction text – always visible */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "9px",
          fontWeight: "normal",
          color: "white",
          textShadow: "1px 1px 0px rgba(0,0,0,0.7)",
          backgroundColor: "rgba(0,0,0,0.5)",
          padding: "2px 8px",
          borderRadius: "12px",
          whiteSpace: "nowrap",
          pointerEvents: "none",
        }}
      >
        ← lower frequency · tap spectrum · higher frequency →
      </div>
    </div>
  );
}