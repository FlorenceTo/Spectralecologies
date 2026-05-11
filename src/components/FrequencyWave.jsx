import { useEffect, useRef, useState } from "react";

export default function FrequencyWave({ bandName, primaryColor, theme }) {
  const canvasRef = useRef(null);
  const animationRef = useRef();
  const [morphProgress, setMorphProgress] = useState(0);

  // Morph duration based on band (higher frequency morphs faster)
  useEffect(() => {
    let morphDuration = 3000;
    if (bandName.includes("X-Band")) morphDuration = 1800;
    else if (bandName.includes("Ku-Band")) morphDuration = 1600;
    else if (bandName.includes("S-Band")) morphDuration = 2400;
    else if (bandName.includes("C-Band")) morphDuration = 2200;
    else if (bandName.includes("L-Band")) morphDuration = 3000;
    else if (bandName.includes("UHF")) morphDuration = 3600;
    
    const startTime = performance.now();
    const animateMorph = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / morphDuration);
      setMorphProgress(progress);
      if (progress < 1) requestAnimationFrame(animateMorph);
    };
    const morphId = requestAnimationFrame(animateMorph);
    return () => cancelAnimationFrame(morphId);
  }, [bandName]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationId;
    let time = 0;
    let width, height;

    // Define wave parameters for accurate frequency representation
    // Higher frequency → more cycles across the canvas
    const getWaveParams = () => {
      if (bandName.includes("L-Band")) {
        // 1-2 GHz – long wavelength, slow movement, moderate amplitude
        return { cyclesPerWidth: 1.8, speed: 0.5, amplitude: 15 };
      } else if (bandName.includes("S-Band")) {
        // 2-4 GHz – more cycles
        return { cyclesPerWidth: 3.5, speed: 0.7, amplitude: 18 };
      } else if (bandName.includes("C-Band")) {
        // 4-8 GHz
        return { cyclesPerWidth: 5.5, speed: 0.9, amplitude: 20 };
      } else if (bandName.includes("X-Band")) {
        // 8-12 GHz – short wavelength, many cycles, higher amplitude?
        return { cyclesPerWidth: 8.0, speed: 1.2, amplitude: 24 };
      } else if (bandName.includes("Ku-Band")) {
        // 12-18 GHz – very tight waves
        return { cyclesPerWidth: 12.0, speed: 1.5, amplitude: 26 };
      } else if (bandName.includes("UHF")) {
        // 300 MHz - 1 GHz – very long wavelength
        return { cyclesPerWidth: 1.2, speed: 0.4, amplitude: 12 };
      } else {
        return { cyclesPerWidth: 3.0, speed: 0.7, amplitude: 18 };
      }
    };

    const { cyclesPerWidth, speed, amplitude } = getWaveParams();

    const resize = () => {
      const container = canvas.parentElement;
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", resize);
    resize();

    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      
      ctx.beginPath();
      for (let x = 0; x < width; x++) {
        const progress = x / width; // 0 to 1 across canvas
        // Number of full cycles = cyclesPerWidth
        const angle = progress * Math.PI * 2 * cyclesPerWidth + time * speed;
        const sineOffset = Math.sin(angle) * amplitude;
        const y = height / 2 + sineOffset * morphProgress;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      time += 0.025;
      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, [bandName, primaryColor, theme, morphProgress]);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />;
}