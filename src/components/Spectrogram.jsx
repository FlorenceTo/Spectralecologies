import { useEffect, useRef, useState } from "react";

export default function Spectrogram({ audioElement, isPlaying, theme }) {
  const canvasRef = useRef(null);
  const waveformCanvasRef = useRef(null);
  const animationRef = useRef();
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const contextRef = useRef(null);
  const imageDataRef = useRef(null);
  const [dynamicRange, setDynamicRange] = useState(18); // dB range (0-35)
  const [cropToEnergy, setCropToEnergy] = useState(true); // fill width by cropping empty high freqs

  // Inferno colour map (dark → bright)
  const amplitudeToColor = (value) => {
    if (value < 0.2) {
      const t = value / 0.2;
      return [Math.floor(20 * t), 0, Math.floor(50 * t)];
    } else if (value < 0.5) {
      const t = (value - 0.2) / 0.3;
      return [Math.floor(80 + 120 * t), Math.floor(20 * t), Math.floor(50 * (1 - t))];
    } else if (value < 0.8) {
      const t = (value - 0.5) / 0.3;
      return [200, Math.floor(100 + 155 * t), 0];
    } else {
      const t = (value - 0.8) / 0.2;
      return [255, Math.floor(255 - 50 * t), Math.floor(50 - 50 * t)];
    }
  };

  // Set up AudioContext once
  useEffect(() => {
    if (!audioElement) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const context = new AudioContext();
    contextRef.current = context;
    const source = context.createMediaElementSource(audioElement);
    sourceRef.current = source;
    const analyser = context.createAnalyser();
    analyser.fftSize = 512;
    analyserRef.current = analyser;
    source.connect(analyser);
    analyser.connect(context.destination);

    return () => {
      if (sourceRef.current) {
        try { sourceRef.current.disconnect(); } catch(e) {}
      }
      if (contextRef.current && contextRef.current.state !== "closed") {
        contextRef.current.close();
      }
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [audioElement]);

  // Animation loop
  useEffect(() => {
    if (!canvasRef.current || !waveformCanvasRef.current || !analyserRef.current) return;

    const specCanvas = canvasRef.current;
    const specCtx = specCanvas.getContext("2d");
    const waveCanvas = waveformCanvasRef.current;
    const waveCtx = waveCanvas.getContext("2d");
    let specWidth, specHeight, waveWidth, waveHeight;

    const resize = () => {
      specWidth = specCanvas.clientWidth;
      specHeight = specCanvas.clientHeight;
      specCanvas.width = specWidth;
      specCanvas.height = specHeight;
      waveWidth = waveCanvas.clientWidth;
      waveHeight = waveCanvas.clientHeight;
      waveCanvas.width = waveWidth;
      waveCanvas.height = waveHeight;
      // initialise image data (black)
      const imageData = specCtx.createImageData(specWidth, specHeight);
      for (let i = 0; i < imageData.data.length; i += 4) {
        imageData.data[i] = 0;
        imageData.data[i+1] = 0;
        imageData.data[i+2] = 0;
        imageData.data[i+3] = 255;
      }
      specCtx.putImageData(imageData, 0, 0);
      imageDataRef.current = imageData;
    };
    window.addEventListener("resize", resize);
    resize();

    const analyser = analyserRef.current;
    const fullBufferLength = analyser.frequencyBinCount; // = 256
    const freqData = new Uint8Array(fullBufferLength);
    const timeData = new Uint8Array(analyser.fftSize);

    const findLastNonEmptyBin = () => {
      for (let i = fullBufferLength - 1; i >= 0; i--) {
        if (freqData[i] > 5) return i + 1;
      }
      return 64;
    };
    let lastNonEmpty = 64;

    const draw = async () => {
      if (!isPlaying) {
        animationRef.current = requestAnimationFrame(draw);
        return;
      }

      if (contextRef.current && contextRef.current.state === "suspended") {
        await contextRef.current.resume();
      }

      analyser.getByteFrequencyData(freqData);
      analyser.getByteTimeDomainData(timeData);

      if (cropToEnergy) {
        const newLast = findLastNonEmptyBin();
        if (newLast > 10) lastNonEmpty = newLast;
      }
      const usedBins = cropToEnergy ? Math.max(32, lastNonEmpty) : fullBufferLength;
      const step = usedBins / specWidth;

      // Shift spectrogram upward
      const rowWidth = specWidth * 4;
      for (let y = 1; y < specHeight; y++) {
        const srcStart = y * rowWidth;
        const destStart = (y - 1) * rowWidth;
        imageDataRef.current.data.copyWithin(destStart, srcStart, srcStart + rowWidth);
      }

      // Draw new bottom row (frequency slice)
      const bottomRowStart = (specHeight - 1) * rowWidth;
      for (let x = 0; x < specWidth; x++) {
        const freqIndex = Math.floor(x * step);
        const linearAmp = freqData[freqIndex] / 255;
        let db = 20 * Math.log10(linearAmp + 1e-6);
        const minDb = -dynamicRange;
        const maxDb = 0;
        let normalized = (db - minDb) / (maxDb - minDb);
        normalized = Math.min(1, Math.max(0, normalized));
        const [r, g, b] = amplitudeToColor(normalized);
        const pos = bottomRowStart + x * 4;
        imageDataRef.current.data[pos] = r;
        imageDataRef.current.data[pos+1] = g;
        imageDataRef.current.data[pos+2] = b;
      }
      specCtx.putImageData(imageDataRef.current, 0, 0);

      // Draw waveform
      waveCtx.clearRect(0, 0, waveWidth, waveHeight);
      waveCtx.beginPath();
      waveCtx.strokeStyle = theme === "light" ? "#333333" : "#9afc97";
      waveCtx.lineWidth = 1.5;
      const stepWave = waveWidth / timeData.length;
      for (let i = 0; i < timeData.length; i++) {
        const x = i * stepWave;
        const y = waveHeight / 2 + (timeData[i] - 128) / 128 * (waveHeight / 2 - 4);
        if (i === 0) waveCtx.moveTo(x, y);
        else waveCtx.lineTo(x, y);
      }
      waveCtx.stroke();

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, theme, dynamicRange, cropToEnergy]);

  return (
    <div style={{ width: "100%", marginTop: "0.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "0.25rem", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.65rem", fontFamily: "monospace" }}>
          <span>Dynamic range:</span>
          <input
            type="range"
            min="0"
            max="35"
            step="1"
            value={dynamicRange}
            onChange={(e) => setDynamicRange(parseInt(e.target.value))}
            style={{ width: "100px", accentColor: "#555", height: "2px", borderRadius: "2px" }}
          />
          <span>{dynamicRange} dB</span>
        </div>
        <label style={{ fontSize: "0.65rem", fontFamily: "monospace", display: "flex", alignItems: "center", gap: "0.3rem" }}>
          <input
            type="checkbox"
            checked={cropToEnergy}
            onChange={(e) => setCropToEnergy(e.target.checked)}
            style={{ accentColor: "#555" }}
          />
          Fill width (crop empty high frequencies)
        </label>
      </div>
      <div style={{ marginBottom: "0.25rem", fontSize: "0.65rem", fontFamily: "monospace", opacity: 0.7 }}>
        waveform (amplitude) · spectrogram (frequency)
      </div>
      <canvas
        ref={waveformCanvasRef}
        style={{
          width: "100%",
          height: "40px",
          backgroundColor: theme === "light" ? "#eaeaea" : "#1a1a1a",
          display: "block",
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "120px",
          backgroundColor: theme === "light" ? "#eaeaea" : "#1a1a1a",
          display: "block",
          marginTop: "2px",
        }}
      />
    </div>
  );
}